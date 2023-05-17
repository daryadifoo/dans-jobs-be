
# Job Back-end

In the project directory, please create `.env` file and set the values of:
```bash
DB_HOST_NAME=
DB_PORT=
DB_NAME=
DB_USER_NAME=
DB_PASSWORD=
JWT_EXPIRES_IN=
JWT_TOKEN_KEY=
```

Setup project
```bash
npm install
npx sequelize-cli db:migrate
```

Run project
```bash
npm run start
```
