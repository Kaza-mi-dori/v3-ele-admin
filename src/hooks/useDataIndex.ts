import { DataIndicesAPI } from "@/api/dataIndices";

/**
 * 使用数据指标的hook
 * 考虑到大屏常常要根据指标集合获取数据，且需要结果是按照时间排序/标识分类的，
 * 所以需要一个hook来处理这些数据
 * @param keyword 标识
 * @param amounts 数据数，主要在某些地方要指明数据数
 * @param since 开始时间
 * @param to 结束时间
 * @returns res 返回数据列表
 */
export const useDataIndex = (
  keyword: string[],
  amount: number,
  since?: string,
  to?: string,
  descByTime?: boolean
): any => {
  const result = ref<any>({});
  const loading = ref<boolean>(false);
  const error = ref<any>(null);

  const fetchData = async () => {
    try {
      const res: any = await DataIndicesAPI.getDataIndicesList({
        标识集合: keyword,
        页码: 1,
        页容量: amount,
        日期晚于: since,
        日期早于: to,
      });
      const originData = res["当前记录"] || [];
      const sortedData = originData.sort((a: any, b: any) => {
        return descByTime
          ? new Date(a.时间).getTime() - new Date(b.时间).getTime()
          : new Date(b.时间).getTime() - new Date(a.时间).getTime();
      });
      const groupedData = sortedData.reduce((acc: any, curr: any) => {
        acc[curr.标识] = acc[curr.标识] || [];
        acc[curr.标识].push(curr);
        return acc;
      }, {});
      result.value = groupedData;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return { result, loading, error, fetchData };
};
