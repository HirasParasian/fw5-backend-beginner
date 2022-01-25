const { query, response } = require("express");
const express = require("express");
const mysql = require("mysql");
const app = express();
const PORT = 5000;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'vehicles_rental'
});
 
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/vehicle/insert', (req, res) => {
    const data = { ...req.body };
    const querySql = 'INSERT INTO kendaraan SET ?';

    connection.query(querySql, data, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ 
                message: 'Gagal insert data!', 
                error: err });
        }
        res.status(201).json({ 
            success: true, 
            message: 'Berhasil insert data!' });
    });
});

app.get('/vehicle', (req, res) => {
    const querySql = 'SELECT * FROM kendaraan';

    connection.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ 
                message: 'Ada kesalahan', 
                error: err });
        }
        res.status(200).json({ 
            success: true, 
            data: rows });
    });
});

app.patch('/vehicle/update/:vehicle_id', (req, res) => {
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM kendaraan WHERE vehicle_id = ?';
    const queryUpdate = 'UPDATE kendaraan SET ? WHERE vehicle_id = ?';

    connection.query(querySearch, req.params.vehicle_id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ 
                message: 'Ada kesalahan', 
                error: err });
        }
        if (rows.length) {
            connection.query(queryUpdate, [data, req.params.vehicle_id], (err, rows, field) => {
                if (err) {
                    return res.status(500).json({ 
                        message: 'Ada kesalahan', 
                        error: err });
                }

                res.status(200).json({ 
                    success: true, 
                    message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ 
                message: 'Data tidak ditemukan!', 
                success: false });
        }
    });
});

app.delete('/vehicle/delete/:vehicle_id', (req, res) => {
    const querySearch = 'SELECT * FROM kendaraan WHERE vehicle_id = ?';
    const queryDelete = 'DELETE FROM kendaraan WHERE vehicle_id = ?';

    connection.query(querySearch, req.params.vehicle_id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ 
                message: 'Ada kesalahan', 
                error: err });
        }
        if (rows.length) {
            connection.query(queryDelete, req.params.vehicle_id, (err, rows, field) => {
                if (err) {
                    return res.status(500).json({ 
                        message: 'Ada kesalahan', 
                        error: err });
                }
                res.status(200).json({ 
                    success: true, 
                    message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ 
                message: 'Data tidak ditemukan!', 
                success: false });
        }
    });
});

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
 
