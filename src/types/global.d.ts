declare global {
  /**
   * 空类型
   */
  type Nullable<T> = T | null;

  type NullableObject<T> = {
    [P in keyof T]: Nullable<T[P]>;
  };
  /**
   * 通用对象
   */
  interface AnyObject {
    [key: string]: any;
  }

  /**
   * 响应数据
   */
  interface ResponseData<T = any> {
    code: string;
    data: T;
    msg: string;
  }

  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number;
    pageSize: number;
  }

  /**
   * 分页查询对象(开发版)
   */
  interface PageQueryDev {
    /** 页码 */
    页码: number;
    /** 每页显示数量 */
    页容量: number;
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /** 数据列表 */
    list: T;
    /** 总数 */
    total: number;
  }

  /**
   * 分页响应对象(开发版)
   */
  interface PageResultDev<T> {
    /** 数据列表 */
    当前记录: T;
    /** 总数 */
    记录总数: number;
    /** 当前页 */
    当前页: number;
    /** 总页数 */
    总页数: number;
  }
  /**
   * 页签对象
   */
  interface TagView {
    /** 页签名称 */
    name: string;
    /** 页签标题 */
    title: string;
    /** 页签路由路径 */
    path: string;
    /** 页签路由完整路径 */
    fullPath: string;
    /** 页签图标 */
    icon?: string;
    /** 是否固定页签 */
    affix?: boolean;
    /** 是否开启缓存 */
    keepAlive?: boolean;
    /** 路由查询参数 */
    query?: any;
  }

  /**
   * 系统设置
   */
  interface AppSettings {
    /** 系统标题 */
    title: string;
    /** 系统版本 */
    version: string;
    /** 是否显示设置 */
    showSettings: boolean;
    /** 是否固定头部 */
    fixedHeader: boolean;
    /** 是否显示多标签导航 */
    tagsView: boolean;
    /** 是否显示侧边栏Logo */
    sidebarLogo: boolean;
    /** 导航栏布局(left|top|mix) */
    layout: string;
    /** 主题颜色 */
    themeColor: string;
    /** 主题模式(dark|light) */
    theme: string;
    /** 布局大小(default |large |small) */
    size: string;
    /** 语言( zh-cn| en) */
    language: string;
    /** 是否开启水印 */
    watermarkEnabled: boolean;
    /** 水印内容 */
    watermarkContent: string;
  }

  /**
   * 下拉选项数据类型
   */
  interface OptionType {
    /** 值 */
    value: string | number;
    /** 文本 */
    label: string;
    /** 子列表  */
    children?: OptionType[];
  }

  /**
   * 数据字典项
   */
  interface DictItem {
    /** 字典值 */
    value: string | number;
    /** 字典标签 */
    label: string;
    /** 字典类型 */
    type: string;
    /** 字典描述 */
    description: string;
    /** 排序 */
    sort: number;
    /** 状态 */
    status: boolean;
  }

  type GenericRecord = Record<string, any>;
}
export {};
