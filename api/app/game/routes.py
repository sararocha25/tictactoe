from flask import render_template, Blueprint, request, current_app as app
from app.models import Game
from app import db, socketio
import json
import random
from flask_socketio import join_room, leave_room
game_blueprint = Blueprint('game', __name__)
from flask_mysqldb import MYSQL
from flask import Flask, request, session, redirect, url_for, render_template
import pymysql 
import re 

app = Flask(__name__)

#MYSQL Conn
app.config['MYSQL_USER'] = 'bca97c0b98a93b'
app.config['MYSQL_PASSWORD'] = '1c291eda'
app.config['MYSQL_HOST'] = 'eu-cdbr-west-01.cleardb.com'
app.config['MYSQL_DB'] = 'heroku_9fcb600dcaa8d34'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MYSQL(app)
#mysql.init_app(app)

@game_blueprint.route('/')
def index():
    # Check if user is loggedin
    if 'loggedin' in session:
   
        # User is loggedin show them the home page
        return render_template('index.html', username=session['username'])
    # User is not loggedin redirect to login page
    return redirect(url_for('login'))
    #return render_template('index.html')


@game_blueprint.route('/game')
def game():
    return render_template('index.html')


@game_blueprint.route('/join/<gameId>')
def join(gameId):
    return render_template('index.html')

@game_blueprint.route('/computer')
def computer():
    return render_template("computer.html")

@app.route('/login/', methods=['GET', 'POST'])
def login():
 # connect
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
  
    # Output message if something goes wrong...
    msg = ''
    # Check if "username" and "password" POST requests exist (user submitted form)
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        # Create variables for easy access
        username = request.form['username']
        password = request.form['password']
        # Check if account exists using MySQL
        cursor.execute('SELECT * FROM accounts WHERE username = %s AND password = %s', (username, password))
        # Fetch one record and return result
        account = cursor.fetchone()
   
    # If account exists in accounts table in out database
        if account:
            # Create session data, we can access this data in other routes
            session['loggedin'] = True
            session['id'] = account['id']
            session['username'] = account['username']
            # Redirect to home page
            #return 'Logged in successfully!'
            return redirect(url_for('home'))
        else:
            # Account doesnt exist or username/password incorrect
            msg = 'Incorrect username/password!'
    
    return render_template('login.html', msg=msg)


@app.route('/register', methods=['GET', 'POST'])
def register():
 # connect
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
  
    # Output message if something goes wrong...
    msg = ''
    # Check if "username", "password" and "email" POST requests exist (user submitted form)
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form:
        # Create variables for easy access
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
   
  #Check if account exists using MySQL
        cursor.execute('SELECT * FROM accounts WHERE username = %s', (username))
        account = cursor.fetchone()
        # If account exists show error and validation checks
        if account:
            msg = 'Account already exists!'
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            msg = 'Invalid email address!'
        elif not re.match(r'[A-Za-z0-9]+', username):
            msg = 'Username must contain only characters and numbers!'
        elif not username or not password or not email:
            msg = 'Please fill out the form!'
        else:
            # Account doesnt exists and the form data is valid, now insert new account into accounts table
            cursor.execute('INSERT INTO accounts VALUES (NULL, %s, %s, %s)', (username, password, email)) 
            conn.commit()
   
            msg = 'You have successfully registered!'
    elif request.method == 'POST':
        # Form is empty... (no POST data)
        msg = 'Please fill out the form!'
    # Show registration form with message (if any)
    return render_template('register.html', msg=msg)


@app.route('/logout')
def logout():
    # Remove session data, this will log the user out
   session.pop('loggedin', None)
   session.pop('id', None)
   session.pop('username', None)
   # Redirect to login page
   return redirect(url_for('login'))



@app.route('/profile')
def profile(): 
 # Check if account exists using MySQL
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
  
    # Check if user is loggedin
    if 'loggedin' in session:
        # We need all the account info for the user so we can display it on the profile page
        cursor.execute('SELECT * FROM accounts WHERE id = %s', [session['id']])
        account = cursor.fetchone()
        # Show the profile page with account info
        return render_template('profile.html', account=account)
    # User is not loggedin redirect to login page
    return redirect(url_for('login'))




@game_blueprint.route('/api/create/game')
def create_game():
    game_id = random.randint(0, 99999)
    game = Game.query.filter_by(game_id=game_id).first()
    while game:
        game_id = random.randint(0, 99999)
    board = {}
    for i in range(9):
        board.update({i: None})
    curr_game = Game(game_id=game_id, next='X', board=json.dumps(board), online='[]')
    try:
        db.session.add(curr_game)
        db.session.commit()
        print('Game Created ' + str(game_id))
    except Exception as e:
        print(e)
        db.session.rollback()
    return {'result': 'success', 'game_id': game_id}


@game_blueprint.route('/api/delete/game/<int:game_id>')
def delete_game(game_id):
    game = Game.query.filter_by(game_id=game_id).first()
    if game:
        try:
            db.session.delete(game)
            db.session.commit()
            print('Game Deleted ' + game_id)
            return {'result': 'success', 'game_id': game_id}
        except Exception as e:
            db.session.rollback()
            print(e)
        return {'result': 'fail'}
    else:
        return {'result': 'fail', 'reason': "Game ID not Found"}


@game_blueprint.route('/api/search/game', methods=['GET', 'POST'])
def search_game():
    received_data = request.json
    game_id = received_data.get('game_id')
    curr_game = Game.query.filter_by(game_id=game_id).first()
    if curr_game:
        print('Game Found ' + game_id)
        return {'result': 'success', 'online': len(json.loads(curr_game.online))}
    else:
        return {'result': 'fail'}


@game_blueprint.route('/api/fetch/game/<int:game_id>')
def fetch_game(game_id):
    curr_game = Game.query.filter_by(game_id=game_id).first()
    if curr_game:
        try:
            if curr_game.board is None:
                board = {}
            else:
                board = json.loads(curr_game.board)
                board_vals = []
            for k, v in board.items():
                board_vals.append(v)
        except Exception as e:
            print(e)
        print(board_vals)
        return {'result': 'success', 'board': board_vals, 'next': curr_game.next}
    else:
        return {'result': 'fail', 'reason': "Game ID not found"}


@socketio.on('join', namespace='/game')
def on_join(data):
    game_id = data.get('game_id')
    player = data.get('player')
    join_room(str(game_id))
    curr_game = Game.query.filter_by(game_id=game_id).first()
    if curr_game:
        online = json.loads(curr_game.online)
        if player not in online:
            online.append(player)
        curr_game.online = json.dumps(online)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(e)
        print('Joined')
        socketio.emit('connected', {'game_id': game_id, 'online': online}, room=str(game_id), namespace='/game')


@socketio.on('leave', namespace='/game')
def on_leave(data):
    game_id = data.get('game_id')
    player = data.get('player')
    leave_room(str(game_id))
    curr_game = Game.query.filter_by(game_id=game_id).first()
    if curr_game:
        try:
            online = json.loads(curr_game.online)
            if player in online:
                online.remove(player)
            curr_game.online = json.dumps(online)
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(e)
            socketio.emit('disconnected', {'game_id': game_id, 'online': online}, room=str(game_id), namespace='/game')

            # Delete rooms automatically after both players leave
            if (len(json.loads(curr_game.online)) == 0):
                try:
                    db.session.delete(curr_game)
                    db.session.commit()
                except Exception as e:
                    db.session.rollback()
                    print(e)
        except Exception as e:
            db.session.rollback()
            print(e)


@socketio.on('move', namespace='/game')
def handle_move(move_data):
    player = move_data.get('player')
    position = move_data.get('position')
    game_id = move_data.get('game_id')
    curr_game = Game.query.filter_by(game_id=game_id).first()
    if curr_game:
        try:
            board = json.loads(curr_game.board)
            board[str(position)] = str(player)
            curr_game.board = json.dumps(board)
            if player == 'X':
                curr_game.next = 'O'
            elif player == 'O':
                curr_game.next = 'X'
            db.session.commit()

            board_vals = []
            for k, v in board.items():
                board_vals.append(v)
            socketio.emit('moved', {'player': player, 'next': curr_game.next,
                          'position': position}, room=str(game_id), namespace='/game')
            #socketio.emit('moved', {'board': board_vals, 'next': curr_game.next, 'game_id': game_id}, room=str(game_id))
        except Exception as e:
            print(e)
            db.session.rollback()


@socketio.on('restartGame', namespace='/game')
def restartGame(data):
    game_id = data.get('game_id')
    curr_game = Game.query.filter_by(game_id=game_id).first()
    if curr_game:
        print('Game Found ' + str(game_id))
        board = {}
        for i in range(9):
            board.update({i: None})
        curr_game.board = json.dumps(board)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(e)
        socketio.emit('restarted', room=str(game_id), namespace='/game')
    else:
        return {'result': 'fail'}
