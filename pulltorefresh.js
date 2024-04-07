const ptr = PullToRefresh.init({
    mainElement: 'body',
    onRefresh() {
      window.location.reload();
    }
  });