<template>
  <div style="position: relative">
    <span class="top-icon search-wrap">
      <label for="search-input" class="fa fa-search"></label>
    </span>
    <input id="search-input" maxlength="50" v-model.trim="keyword" @keyup.enter="onSearch"/>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import listQuery from '../schema/list';
export default {
  name: 'Search',
  data() {
    return {
      keyword: '',
    };
  },
  methods: {
    ...mapActions(['_getList']),
    onSearch() {
      location.href = '/?s=' + this.keyword;
      // this._getList({
      //   query: listQuery,
      //   variables: {
      //     currentPage: 1,
      //     keyword: this.keyword,
      //     // pageSize: this.pageSize || 4,
      //     // post_type: "post",
      //     // post_status: "publish",
      //   },
      // });
    },
  },
};
</script>
