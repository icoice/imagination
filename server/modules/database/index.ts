import mysql from 'mysql'

export default class Database {

  private softName:string;
  private db:any;
  private linker:any;
  private connection:any = null;
  private logger:any = {};
  private currentUseDB:string = '';
  private ifRecordLog:any = () => {};
  private tables;
  private dbList:any = {
    mysql,
    mariadb: mysql
  };

  constructor(dbname:string = 'mariadb') {
    this.softName = dbname;
    this.db = this.dbList[dbname];
  }

  private record(info:any) {
    this.logger[Date.now()] = info;
    this.logger.lastLog = info;
    this.ifRecordLog(this.logger);
  }

  private ifErr(err:any) {
    const {connection} = this;

    this.record(err);

    if (connection && connection.state === 'disconnected') {
      connection.destroy();
    }
  }

  private ifConnect(cb:Function) {
    this.connection && cb(this.connection);
  }

  private async step() {
      
  }

  public structure(struct) {
    const {dbname, talbes} = struct;
    this.currentUseDB = dbname;
    this.tables = talbes;
  }

  public connect(setting:any) {
    const {softName, db} = this;
    const {user, password, host, database} = setting;
    let linker;

    // 链接数据库
    this.linker = new Promise(resolve => {
      this.record(`${softName} standby to connect ...`);
      if (softName === 'mysql' || softName === 'mariadb') {
          this.connection = db.createConnection({user, password, host, database});
          resolve();
      }
    }).
    catch(err => this.ifErr(err)).
    then(() => {
      this.ifConnect(connection => {
         connection.connect(err => {
            this.record(`${softName} is connectied ...`);
            return err ? Promise.reject(err) : Promise.resolve();
         });
      })
    }).catch(err => this.ifErr(err));

    // 选定数据库
    linker = this.useDatabase(database);

    //linker.then(name => {
      //this.currentUseDB = name;
      //this.record(`${this.softName} use ${name} ...`);
    //}).catch(err => this.ifErr(err));
  }

  protected createDatabase(dbname: string = '') {
    const {linker} = this;
    return linker.then(() => {
      this.ifConnect(connection => {
        connection.query(`CREATE DATABASE ${dbname}`, err => err ? Promise.reject(err) : Promise.resolve(dbname));
      })
    }).catch(err => this.ifErr(err));
  }

  protected useDatabase(dbname:string = '') {
    const {linker} = this;
    return linker.then(() => {
        this.ifConnect(connection => {
          connection.query(`USE ${dbname}`, err => {
            err ? Promise.reject(err) : Promise.resolve(dbname);
          });
        })
        return dbname;
    }).catch(err => this.ifErr(err));
  }

  public onRecordLog(cb:any) {
    this.ifRecordLog = cb;
  }
}
