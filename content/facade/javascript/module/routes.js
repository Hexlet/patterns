import { User } from './entities';

export default router => router
  .get('users', '/users', async (ctx) => {
    const users = await User.findAll();
    ctx.render('users', { users });
  })
  .get('newUser', '/users/new', (ctx) => {
    const user = User.build();
    ctx.render('users/new', { user });
  })
  .post('users', '/users', async (ctx) => {
    const { form } = ctx.request.body;
    const user = User.build(form);
    await user.save();
    ctx.flash.set('User has been created');
    ctx.redirect(router.url('root'));
  });
