import {TINY_INT, SMALL_INT, MEDIUM_INT, INT, BIG_INT} from './constants'

// 数据类型存在固定长度，其长度以及数据总量足以影响内存占用量或I/O吞吐。
export const dtVolume = (byte: number) => {
    const unsigned: number = Math.pow(2, byte * 8);
    const singed: number = Math.pow(2, byte * (8 - 1));
    return {
        byte,
        scope: {
           unsigned: {min: 0,  max:  unsigned - 1},
           singed: {min:-singed, max: singed - 1}
        }
    }
}

export const dataTypeIntVolume: any = {
    [TINY_INT]: dtVolume(1),
    [SMALL_INT]:  dtVolume(2),
    [MEDIUM_INT]: dtVolume(3),
    [INT]: dtVolume(4),
    [BIG_INT]: dtVolume(8)
}

export const  dbMethod: any  = {
    currentTime: 'CURRENT_TIME',
    now: 'NOW()',
}
