<template>
  <div class="main-container">
    <div id="process-canvas-container" class="process-canvas-container" />
    <div id="js-properties-panel" class="properties-panel" />
  </div>
</template>

<script setup>
import { markRaw, onMounted, ref } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";

let containerEl = ref < Nullable < HTMLElement >> null;
let bpmnModeler = ref < Nullable < BpmnModeler >> null;
onMounted(async () => {
  init();
});

/**
 * 初始化流程图
 */
let init = () => {
  containerEl.value = document.getElementById("container");
  // 加markRaw去除双向绑定作用域
  bpmnModeler.value = markRaw(
    new BpmnModeler({
      container: containerEl.value,
      //添加控制板
      propertiesPanel: {
        parent: "#js-properties-panel",
      },
      additionalModules: [
        // 右边的属性栏
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
    })
  );
  bpmnModeler.value.createDiagram();
};
</script>
