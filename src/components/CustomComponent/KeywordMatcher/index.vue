<!-- 关键词匹配 -->
<template>
  <div>
    <el-input v-model="keyword" placeholder="请输入关键词" />
  </div>
</template>

<script setup lang="ts">
const keyword = ref("");

function kmpSearch(keyword: string, text: string) {
  const next = new Array(keyword.length).fill(0);
  for (let i = 1; i < keyword.length; i++) {
    let j = next[i - 1];
  }
  let i = 0,
    j = 0;
  while (i < text.length && j < keyword.length) {
    if (j === -1 || text[i] === keyword[j]) {
      i++;
      j++;
    } else {
      j = next[j];
    }
  }
  return j === keyword.length;
}

class ACAutomaton {
  private root: any;
  private keyword: string;
  constructor(keyword: string) {
    this.keyword = keyword;
    this.root = this.buildACAutomaton(keyword);
  }
  private buildACAutomaton(keyword: string) {
    const root = {};
    for (const word of keyword) {
      let node = root;
    }
  }
  private insert(word: string) {
    let node = this.root;
    for (const char of word) {
      if (!node[char]) {
        node[char] = {};
      }
      node = node[char];
    }
    node.isEnd = true;
    node.word = word;
    node.fail = null;
    node.output = [];
  }

  private buildFail() {
    const queue = [];
    for (const char of this.keyword) {
      queue.push(this.root[char]);
    }
  }

  private search(text: string) {
    let node = this.root;
    for (const char of text) {
      node = node[char];
    }
    return node.output;
  }
}
</script>
