import type LogicFlow from "@logicflow/core";
import { RectNode, RectNodeModel } from "@logicflow/core";

/**
 * 自定义节点
 * 1. model - 节点数据模型, 用于存储节点数据，并提供数据操作接口
 * 2. view - 节点视图，用于渲染节点
 */

/**
 * 审批任务TaskNode
 * 子类型： 1. 系统任务 2. 人工任务
 */
export class TaskNode extends RectNode {}

export class TaskNodeModel extends RectNodeModel {
  // 节点类型
  getNodeType() {
    return "task";
  }

  setAttributes(): void {
    this.width = 200;
    this.height = 80;
    this.radius = 10;
    this.label = "审批任务";
    this.labelCfg = {
      position: "top",
      style: {
        fontSize: 12,
      },
    };
  }

  // 重写文本样式
  getTextStyle(): LogicFlow.TextNodeTheme {
    return {
      fontSize: 12,
      fontWeight: "bold",
    };
  }
}
