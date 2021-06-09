from flask import render_template, Blueprint, request, current_app as app
from app.models import Game
from app import db, socketio
import json
import random
from flask_socketio import join_room, leave_room
game_blueprint = Blueprint('game', __name__)
#from flask_mysqldb import MYSQL
from flask import Flask, request, session, redirect, url_for, render_template, flash
#import pymysql 
#import re 

import psycopg2
import psycopg2.extras
import re 
from werkzeug.security import generate_password_hash, check_password_hash
 
#app = Flask(__name__)
 
DB_HOST = "ec2-54-155-226-153.eu-west-1.compute.amazonaws.com"
DB_NAME = "dessvf9689cvi3"
DB_USER = "lqgpnwfbpgtmty"
DB_PASS = "899188a269ef9112a6cf6b6fe8da76dcbf4e752e6be1707a2c43d3521a6021c8"
 
conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)

@game_blueprint.route('/')
def index():
    return render_template('index.html')


@game_blueprint.route('/game')
def game():
    return render_template('index.html')


@game_blueprint.route('/join/<gameId>')
def join(gameId):
    return render_template('index.html')

@game_blueprint.route('/computer')
def computer():
    return render_template("computer.html")

@game_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
   
    # Check if "username" and "password" POST requests exist (user submitted form)
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        username = request.form['username']
        password = request.form['password']
        print(password)
 
        # Check if account exists using MySQL
        cursor.execute('SELECT * FROM user WHERE username = %s', (username,))
        # Fetch one record and return result
        account = cursor.fetchone()
 
        if account:
            password_rs = account['password']
            print(password_rs)
            # If account exists in users table in out database
            if check_password_hash(password_rs, password):
                # Create session data, we can access this data in other routes
                #session['loggedin'] = True
                #['id'] = account['id']
                session['username'] = account['username']
                # Redirect to home page
                return redirect(url_for('index.html'))
            else:
                # Account doesnt exist or username/password incorrect
                flash('Incorrect username/password')
        else:
            # Account doesnt exist or username/password incorrect
            flash('Incorrect username/password')
 
    return render_template('login.html')

@game_blueprint.route('/register' , methods=['GET', 'POST'])
def register():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
 
    # Check if "username", "password" and "email" POST requests exist (user submitted form)
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form:
        # Create variables for easy access
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
    
        _hashed_password = generate_password_hash(password)
 
        #Check if account exists using MySQL
        cursor.execute('SELECT * FROM user WHERE username = %s', (username,))
        account = cursor.fetchone()
        print(account)
        # If account exists show error and validation checks
        if account:
            flash('Account already exists!')
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            flash('Invalid email address!')
        elif not re.match(r'[A-Za-z0-9]+', username):
            flash('Username must contain only characters and numbers!')
        elif not username or not password or not email:
            flash('Please fill out the form!')
        else:
            # Account doesnt exists and the form data is valid, now insert new account into users table
            cursor.execute("INSERT INTO users ( username, password, email) VALUES (%s,%s,%s)", (username, _hashed_password, email))
            conn.commit()
            flash('You have successfully registered!')
    elif request.method == 'POST':
        # Form is empty... (no POST data)
        flash('Please fill out the form!')
    # Show registration form with message (if any)
    return render_template('register.html')


    return render_template("register.html")

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
