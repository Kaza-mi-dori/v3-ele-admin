import request2 from "@/utils/request2";

const DICT_DATA_BASE_URL = "/Api/Core/Base";

export const DictDataAPI = {
  /**
   * 获取字典数据列表
   */
  getDictDataList: (data: any) => {
    return request2({
      url: `${DICT_DATA_BASE_URL}/DictItem/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 获取字典数据详情
   */
  getDictDataDetail: (id: number | string) => {
    return request2({
      url: `${DICT_DATA_BASE_URL}/DictItem`,
      method: "get",
      params: { id },
    });
  },

  /**
   * 新增字典数据
   */
  addDictData: (data: any) => {
    return request2({
      url: `${DICT_DATA_BASE_URL}/DictItem`,
      method: "post",
      data,
    });
  },

  /**
   * 修改字典数据
   */
  updateDictData: (data: any) => {
    return request2({
      url: `${DICT_DATA_BASE_URL}/DictItem`,
      method: "patch",
      data,
    });
  },

  /**
   * 删除字典数据
   */
  deleteDictData: (id: number | string) => {
    return request2({
      url: `${DICT_DATA_BASE_URL}/DictItem`,
      method: "delete",
      params: { id },
    });
  },
};

export const DictDefinitionAPI = {
  /**
   * 获取字典定义列表
   */
  getDictDefinitionList: (data: any) => {
    return request2({
      url: `${DICT_DATA_BASE_URL}/DictDefinition/Query`,
      method: "post",
      data,
    });
  },

  /**
   * 获取字典定义详情
   */
  getDictDefinitionDetail: (id: number | string) => {
    return request2({
      url: `${DICT_DATA_BASE_URL}/DictDefinition`,
      method: "get",
      params: { id },
    });
  },

  /**
   * 新增字典定义
   */
  addDictDefinition: (data: any) => {
    return request2({
      url: `${DICT_DATA_BASE_URL}/DictDefinition`,
      method: "post",
      data,
    });
  },

  /**
   * 修改字典定义
   */
  updateDictDefinition: (data: any) => {
    return request2({
      url: `${DICT_DATA_BASE_URL}/DictDefinition`,
      method: "patch",
      data,
    });
  },

  /**
   * 删除字典定义
   */
  deleteDictDefinition: (id: number | string) => {
    return request2({
      url: `${DICT_DATA_BASE_URL}/DictDefinition`,
      method: "delete",
      params: { id },
    });
  },
};

export interface DictDefinitionQuery {
  id集合: Array<number | string>;
  标识集合: Array<string>;
  状态集合: Array<string>;
  分类1: string;
  分类2: string;
  分类3: string;
  名称: string;
}

export interface DictItemQuery {
  id集合: Array<number | string>;
  标识集合: Array<string>;
  状态集合: Array<string>;
  /** 使用该字典项时显示的字面量 */
  显示: string;
  /** 使用该字典项时对应的值 */
  值: any;
}
