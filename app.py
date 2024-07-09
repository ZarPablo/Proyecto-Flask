from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/contactos', methods=['GET'])
def ver_productos():
    db = mysql.connector.connect(
        host='pabloalbrecht.mysql.pythonanywhere-services.com',
        user='pabloalbrecht',
        password='alaska3030',
        database='pabloalbrecht$agenda'
    )

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contactos")

    contactos = cursor.fetchall()

    cursor.close()
    return jsonify(contactos)


@app.route('/eliminar_contacto/<int:id>', methods=['DELETE'])
def eliminar_contacto(id):
    db = mysql.connector.connect(
        host='pabloalbrecht.mysql.pythonanywhere-services.com',
        user='pabloalbrecht',
        password='alaska3030',
        database='pabloalbrecht$agenda'
    )

    cursor = db.cursor()
    cursor.execute("DELETE FROM contactos WHERE id = %s", (id,))

    db.commit()
    cursor.close()
    return jsonify({"mensaje":"CONTACTO ELIMINADO CON EXITO!!!"})


@app.route('/agregar_contacto', methods=['POST'])
def crear_contacto():
    info = request.json
    
    db = mysql.connector.connect(
        host='pabloalbrecht.mysql.pythonanywhere-services.com',
        user='pabloalbrecht',
        password='alaska3030',
        database='pabloalbrecht$agenda'
    )

    cursor = db.cursor()
    cursor.execute("INSERT INTO contactos(nombre,direccion,telefono) VALUES(%s,%s,%s)", (info["nombre"],info["direccion"],info["telefono"]))
    db.commit()
    cursor.close()
    return jsonify({"mensaje":"CONTACTO CREADO CON EXITO!!!"})


@app.route('/actualizar_contacto/<int:id>', methods=['PUT'])
def modificar_contacto(id):
    info = request.json
  
    db = mysql.connector.connect(
        host='pabloalbrecht.mysql.pythonanywhere-services.com',
        user='pabloalbrecht',
        password='alaska3030',
        database='pabloalbrecht$agenda'
    )

    cursor = db.cursor()
    cursor.execute("UPDATE contactos SET nombre= %s, direccion= %s, telefono= %s WHERE id = %s", (info["nombre"],info["direccion"],info["telefono"] , id)) 

    db.commit()
    cursor.close()
    return jsonify({"mensaje":"CONTACTO ACTUALIZADO CON EXITO!!!"})


if __name__ == '__main__':
    app.run(debug=True)

