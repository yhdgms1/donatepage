const loadDraggable = () => {
  return import('npm:@shopify/draggable').then(({ Sortable, Plugins }) => {
    return {
      Sortable,
      Plugins,
    }
  })
}

export { loadDraggable }