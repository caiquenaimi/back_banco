const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'aulaback',
    password: 'ds564',
    port: 7007,
});

const calcAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const calcZodiacSign = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) {
        return 'Capricornio';
    } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
        return 'Aquario';
    } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20))
        return 'Peixes';
    else if ((month == 3 && day >= 21) || (month == 4 && day <= 20))
        return 'Aries';
    else if ((month == 4 && day >= 21) || (month == 5 && day <= 20))
        return 'Touro';
    else if ((month == 5 && day >= 21) || (month == 6 && day <= 20))
        return 'Gemeos';
    else if ((month == 6 && day >= 21) || (month == 7 && day <= 22))
        return 'Cancer';
    else if ((month == 7 && day >= 23) || (month == 8 && day <= 22))
        return 'Leao';
    else if ((month == 8 && day >= 23) || (month == 9 && day <= 22))
        return 'Virgem';
    else if ((month == 9 && day >= 23) || (month == 10 && day <= 22))
        return 'Libra';
    else if ((month == 10 && day >= 23) || (month == 11 && day <= 22))
        return 'Escorpiao';
    else if ((month == 11 && day >= 23) || (month == 12 && day <= 21))
        return 'Sagitario';
}

app.use(express.json());

app.get('/usuarios', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios');
        res.json({
            status: 'sucesso',
            mensagem: 'Todos os usuários retornados com sucesso',
            quantidade: resultado.rowCount,
            usuarios: resultado.rows,
        });
    } catch (error) {
        console.error('Erro ao buscar todos usuários', error);
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).send({ mensagem: `id : ${id} não encontrado` });
        }
        res.json({
            status: 'sucesso',
            mensagem: 'Usuário retornado com sucesso',
            usuario: resultado.rows[0],
        });
    } catch (error) {
        console.error('Erro ao buscar usuário', error);
    }
});


app.post('/usuarios', async (req, res) => {
    const { name, surname, email, birthday } = req.body;

    if (!(/^\d{4}-\d{2}-\d{2}$/.test(birthday))) {
        return res.status(400).send({ mensagem: 'Data de nascimento inválida. Use o formato YYYY-MM-DD.' });
    }

    if (!name || !surname || !email || !birthday) {
        return res.status(400).send({ mensagem: 'Todos os campos são obrigatórios' });
    }

    if (name.length < 3 || name.length > 50) {
        return res.status(400).send({ mensagem: 'O nome deve ter entre 3 e 50 caracteres' });
    }

    if (surname.length < 3 || surname.length > 50) {
        return res.status(400).send({ mensagem: 'O sobrenome deve ter entre 3 e 50 caracteres' });
    }

    if (email.length < 3 || email.length > 50) {
        return res.status(400).send({ mensagem: 'O email deve ter entre 3 e 50 caracteres' });
    }


    const age = calcAge(new Date(birthday));
    const zodiacSign = calcZodiacSign(new Date(birthday));

    try {
        await pool.query('INSERT INTO usuarios (name, surname, email, birthday, age, zodiacSign) VALUES ($1, $2, $3, $4, $5, $6)', [name, surname, email, birthday, age, zodiacSign]);
        res.status(201).send({
            status: 'sucesso',
            mensagem: 'Usuário inserido com sucesso',
        });
    } catch (error) {
        console.error('Erro ao inserir usuário', error);
        res.status(500).send('Erro ao inserir usuário');
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.status(200).send({status: "sucesso", mensagem: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).send('Erro ao excluir usuário');
    }
});

app.put('/usuarios/:id', async (req, res) => {

    if (!(/^\d{4}-\d{2}-\d{2}$/.test(req.body.birthday))) {
        return res.status(400).send({ mensagem: 'Data de nascimento inválida. Use o formato YYYY-MM-DD.' });
    }

    if (!req.body.name || !req.body.surname || !req.body.email || !req.body.birthday) {
        return res.status(400).send({ mensagem: 'Todos os campos são obrigatórios' });
    }

    if (req.body.name.length < 3 || req.body.name.length > 50) {
        return res.status(400).send({ mensagem: 'O nome deve ter entre 3 e 50 caracteres' });
    }

    if (req.body.surname.length < 3 || req.body.surname.length > 50) {
        return res.status(400).send({ mensagem: 'O sobrenome deve ter entre 3 e 50 caracteres' });
    }

    if (req.body.email.length < 3 || req.body.email.length > 50) {
        return res.status(400).send({ mensagem: 'O email deve ter entre 3 e 50 caracteres' });
    }


    try {
        const { id } = req.params;
        const age = calcAge(new Date(req.body.birthday));
        const zodiacSign = calcZodiacSign(new Date(req.body.birthday));
        const { name, surname, email, birthday } = req.body;
        await pool.query('UPDATE usuarios SET name = $1, surname = $2, email = $3, birthday = $4, age = $5, zodiacSign = $6 WHERE id = $7', [name, surname, email, birthday, age, zodiacSign, id]);
        res.status(200).send({status: "sucesso", mensagem: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).send('Erro ao atualizar usuário');
    }
});



app.listen(PORT, () => {
    console.log(`Roteando e online 😎, Server rodando na porta: ${PORT}`);
});

app.get('/', (req, res) => {
    res.send(' ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢻⣧⣀⣼⠇⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄ ⠄⣠⣾⣿⣷⡀⠄⠄⠄⠄⠄⣤⣶⣿⣿⣿⣦⣄⠄⠄⠄⠄⠄⣠⣾⣿⣷⣄⠄ ⠺⣿⣿⣿⣿⣿⣦⡀⠄⠄⠄⠿⢿⣿⣿⣿⡿⠟⠄⠄⠄⢀⣼⣾⣿⣿⣿⡿⠇ ⠄⠈⠻⢿⣿⣿⢛⡇⠄⠄⢀⣠⡤⣖⣗⣷⠤⣄⣀⠄⠄⣸⠛⣿⣿⡿⠋⠄⠄ ⠄⠄⠄⠄⠙⠛⠛⢗⡴⣛⠭⣖⢂⠏⡟⢹⠖⢖⠭⡓⢤⡛⠛⠛⠉⠄⠄⠄⠄ ⠄⠄⠄⠄⠄⠄⡴⣫⢞⢈⡳⠛⠈⠉⠉⠉⠙⠺⢦⡿⠢⡙⣆⠄⠄⠄⠄⠄⠄ ⠄⠄⠄⠄⠄⡾⣱⠉⡲⣏⢀⡠⠴⢶⣟⣓⡤⠔⣚⠑⣖⢛⡌⣧⠄⠄⠄⠄⠄ ⠄⠄⠄⠄⢸⢧⣇⢬⠃⠐⢵⣏⣛⠸⢷⣶⣚⡭⠾⠄⠘⣑⣺⢸⡄⠄⠄⠄⠄ ⠄⠄⠄⠨⣯⣿⣙⣨⠄⠄⠣⠩⢖⣫⠭⠭⡵⣚⣭⢅⠄⡷⢶⣿⣽⠄⠄⠄⠄ ⠄⠄⠄⠈⠹⡝⣿⡿⡀⠄⠈⣋⡭⢖⣫⡭⣞⡽⢖⣫⢤⣉⣹⢹⠏⠄⠄⠄⠄ ⠄⣦⡀⠄⠄⢳⡱⣥⡶⢄⠄⠸⡚⠁⢰⣛⡭⠖⠉⡠⠳⣭⢇⡟⠄⠄⢀⣴⠄ ⢰⣿⢷⣤⡀⠈⠳⣝⢤⣾⠶⣤⣕⣀⠄⣀⣀⣤⠚⣷⡶⣣⠞⠄⢀⣴⢿⣿⠄ ⠄⣿⢞⣷⡀⠄⢀⠜⠲⣍⡲⠿⣢⣰⣩⣠⡃⠿⣛⡡⠞⠥⡀⠄⣠⣟⡶⡿⠄ ⠄⠄⠈⢫⡻⣶⡟⠁⠄⠄⠉⠑⠒⣗⣟⡗⠒⠛⠉⠄⠄⠄⢨⣶⣯⠞⠄⠁⠄ ⠄⠄⠄⡠⠻⢮⡻⣦⣄⡀⠄⠄⣀⣥⣥⣥⡀⠄⠄⣀⣠⡶⣿⡿⠛⢆⠄⠄⠄ ⠄⠄⠾⠉⠄⠄⠙⠿⣽⣟⣿⣿⡿⠟⢹⣿⣿⣿⣟⣿⣽⠞⠋⠄⠄⠄⠑⠄⠄');
});
