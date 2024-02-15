import { User } from "src/entity/user.entity";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const config: PostgresConnectionOptions = {
    type: "postgres",
    // database: process.env.DATABASE_NAME,
    // username: process.env.DATABASE_USERNAME,
    // password: process.env.DATABASE_PASSWORD,
    // host: process.env.HOST,
    // port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    database: "quora_clone",
    username: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    entities: [User],
    synchronize: true
}


export default config;