// import * as db from '$lib/server/usersDb.js';

// export function load({cookies}) {
//   console.log('userid', cookies);
//   const id = cookies.get('userid');

//   if (!id) {
//     cookies.set('userid', crypto.randomUUID(), {path: '/'});
//   }

//   return {
//     todos: db.getTodos(id) ?? []
//   };
// }

// export const actions = {
//   default: async ({cookies, request}) => {
//     const data = await request.formData();
//     db.createTodo(cookies.get('userid'), data.get('description'));
//   }
// };
