export default ({
  Vue,
  options,
  router,
  siteData
}) => {
  const { routes } = router.options;

  routes.unshift({
    name: 'google-site-verification',
    path: '/google80e84fabb895736c.html',
  });
}
