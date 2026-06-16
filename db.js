import mariadb from "mariadb"

const pool = mariadb.createPool ({ 
        host: 'localhost',
        user: 'user',
        password: "password",
        database: "db",
        connectionLimit: "1"
    })

export default pool