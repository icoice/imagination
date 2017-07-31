/* *
 *  db - 存储引擎
 * */

export const INNO_DB: string = 'InnoDB';
export const MY_ISAM: string = 'MyISAM';
export const MEMORY: string = 'MEMORY';

/* *
 *  db  - 数据类型
 *  选择适合的数据类型有效节省服务空间，特别是数据达到百万级时最有效。
 * */

// 整型
export const TINY_INT:  string = 'TINYINT';
export const SMALL_INT: string = 'SMALLINT';
export const MEDIUM_INT: string = 'MEDIUMINT';
export const INT: string = "INT";
export const BIG_INT: string = 'BIGINT';

// 字符串类型
// CHAR的查询速度快于VAR_CHAR, VAR_CHAR则因长度可变的特性，占用空间小，而且适合存储大量文本。
export const CHAR: any = (len:number) => `CHAR(${len})`;
export const VAR_CHAR: any = (len:any) => `VARCHAR${len ? `(${len})` : '' }`;
export const TINY_TEXT: string = 'TINYTEXT' ; // 0 ~ 255 byte , 存储时 ＋ 2byte
export const TEXT: string = 'TEXT'; //0 ~ 65535byte , 存储时 ＋ 2byte
export const MEDIUM_TEXT: string = 'MEDIUMTEXT'; // 0 ~ 167772150byte, 存储时 ＋ 3byte
export const LONG_TEXT: string = 'LONGTEXT'; //0 ~ 4294967295byte, 存储时 ＋ 4byte

// 浮点型
export const FLOAT:any = (len:number, decimal:number) =>  `FLOAT(${len}, ${decimal})`; // 4byte
export const DOUBLE:any = (len:number, decimal:number) =>  `DOUBLE(${len}, ${decimal})`; // 8byte

// 定点数对其他浮定型的精度比较高，因为Mariadb存储时实际为字符串。
export const DECIMAL:any = (len:number, decimal:number) =>  `DECIMAL(${len}, ${decimal})`; // M+2byte

// 日期类型
export const YEAR: string = 'YEAR'; // 1byte 0000, 00 ~ 69 表 2000 ～ 2069， 70 ～99 表 1970 ～ 1999， 0 表 0000， ‘0’ 表 2000
export const DATE: string = 'DATE'; // 4byte YYYY-MM-DD, 0 表 0000-00-00
export const TIME: string = 'TIME'; // 3byte HH:II:SS
export const DATE_TIME: string = 'DATE_TIME'; // 8byte 0000-00-00 00:00:00
export const TIMESTAMP: string = 'TIMESTAMP'; // 4byte 000000000000000 取值范围 1970-01-01 08:00:01 ~ 2038-01-19 11:14:07, 按时区获得时间。

// 枚举类型，枚举内容通常仅存一份数据正文，字段里面存储的仅编号，有效节省空间。
export const ENMU: any = (arr:any) => `ENMU(${arr.join(',') })`; // 支持最多65535个值
export const SET: any = (arr:any) => `SET(${arr.join(',')})`;  // 最多64个

//二进制类型
export const BINARY: any = (len:number) => `BINARY(${len})` ;
export const VAR_BINARY: any = (len:number) => `VARBINARY(${len})`; // ＋ 1byte
export const BIT: any = (len:number) => `BIT(${len})`; // 最大64
export const TINY_BLOB: string = `TINYBLOB`; // 0 ~ 255

// BLOB 存储大型二进值数据，适合图片或PDF等半结构数据存储。
export const BLOB: string = `BLOB`; // 0 ~ 2 ^ 16 - 1
export const MEDIUM_BLOB = `MEDIUMBLOB`; // 0 ~ 2 ^ 24 - 1
export const LONG_BLOB = `LONGBLOB`; // 0 ~ // 0 ~ 2 ^ 32 - 1
