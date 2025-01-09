import type LogicFlow from "@logicflow/core";
import { RectNode, RectNodeModel, h } from "@logicflow/core";

/**
 * 自定义节点
 * 1. model - 节点数据模型, 用于存储节点数据，并提供数据操作接口
 * 2. view - 节点视图，用于渲染节点
 */

/**
 * tips: 示例完全自定义的节点, Node定义形状, 存放实际渲染方法；Model定义属性
 * 审批任务TaskNode
 * 子类型： 1. 系统任务 2. 人工任务
 */
export class ParallelTaskNode extends RectNode {
  /**
   * 自定义外观
   */
  getShape() {
    const { model } = this.props;
    const { x, y, width, height } = model;
    const style = model.getNodeStyle();
    return h(
      "svg",
      // 设置svg的样式
      {
        x: x - width / 2 + 5,
        y: y - height / 2 + 5,
        width: width - 10,
        height: height - 10,
      },
      // 设置svg的子元素
      [
        h("rect", {
          x: 0,
          y: 0,
          width: width - 10,
          height: height - 10,
          ...style,
        }),
        h(
          "g",
          {
            transform: `translate(${width - 20}, ${height - 20})`,
          },
          [
            h(
              "text",
              {
                x: -20,
                y: 0,
                dominantBaseline: "middle",
                textAnchor: "central",
                value: "测试",
                fill: "#000",
                fontSize: 12,
                fontWeight: "bold",
              },
              "测试"
            ),
          ]
        ),
      ]
    );
  }
}

export class ParallelTaskNodeModel extends RectNodeModel {
  // 节点类型
  getNodeType() {
    return "task";
  }

  // 节点样式
  getNodeStyle(): {
    [x: string]: unknown;
    fill?: string | undefined;
    stroke?: string | undefined;
    strokeWidth?: number | undefined;
    radius?: number | undefined;
    rx?: number | undefined;
    ry?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    path?: string | undefined;
  } {
    return {
      fill: "lightgreen",
      stroke: "#000",
      strokeWidth: 2,
    };
  }

  // 设置节点属性
  setAttributes(): void {
    this.width = 120;
    this.height = 80;
    this.radius = 10;
    this.label = "并行任务";
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

export class SerialTaskNode extends RectNode {
  getShape() {
    const { model } = this.props;
    const { x, y, width, height } = model;
    const style = model.getNodeStyle();
    return h(
      "svg",
      {
        x: x - width / 2 + 5,
        y: y - height / 2 + 5,
        width: width - 10,
        height: height - 10,
      },
      [
        h("rect", {
          x: 0,
          y: 0,
          width: width - 10,
          height: height - 10,
          ...style,
        }),
      ]
    );
  }
}

export class SerialTaskNodeModel extends RectNodeModel {
  getNodeType() {
    return "serial";
  }

  getNodeStyle(): {
    [x: string]: unknown;
    fill?: string | undefined;
    stroke?: string | undefined;
    strokeWidth?: number | undefined;
  } {
    return {
      fill: "lightblue",
      stroke: "#000",
      strokeWidth: 2,
    };
  }

  setAttributes(): void {
    this.width = 120;
    this.height = 80;
    this.radius = 10;
    this.label = "串行任务";
  }
}
