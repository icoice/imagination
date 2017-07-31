import Database from '../modules/database';
import {INNO_DB,  TINY_INT, INT, CHAR} from '../modules/database/constants'

const account = {
    host: 'localhost',
    user: 'root',
    password: 'icoice524841014',
    database: 'mysql'
}
const dbname =  'imag_users'
const tables = {}

tables['user_power_category'] = {
  engines: INNO_DB,
  fields: {
      id: {
          data_type: TINY_INT
      },
      power_name: {
          data_type: CHAR(10)
      },
      power_level: {
          data_type: TINY_INT
      },
      limit_amount: {
          data_type: TINY_INT
      }
  }
}

tables['user_id_cards'] = {
    engines: INNO_DB,
    fields: {
        id: {
            data_type: INT
        },
    }
}

const tree = {
    dbname,
    tables
}

test('Database setting', () => {
    const db = new Database('mariadb');
    db.onRecordLog(logger => console.log(logger));
    db.structure(tree);
    db.connect(account);
});
