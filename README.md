# Example app with [chakra-ui](https://github.com/chakra-ui/chakra-ui) and Typescript

This example features how to use [chakra-ui](https://github.com/chakra-ui/chakra-ui) as the component library within a Next.js app with typescript.

Next.js and chakra-ui have built-in TypeScript declarations, so we'll get autocompletion for their modules straight away.

We are connecting the Next.js `_app.js` with `chakra-ui`'s Provider and theme so the pages can have app-wide dark/light mode. We are also creating some components which shows the usage of `chakra-ui`'s style props.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui-typescript&project-name=with-chakra-ui-typescript&repository-name=with-chakra-ui-typescript)

## How to use

### Using `create-next-app`

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-chakra-ui-typescript with-chakra-ui-typescript-app
# or
yarn create next-app --example with-chakra-ui-typescript with-chakra-ui-typescript-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Notes

Chakra has supported Gradients and RTL in `v1.1`. To utilize RTL, [add RTL direction and swap](https://chakra-ui.com/docs/features/rtl-support).

If you don't have multi-direction app, you should make `<Html lang="ar" dir="rtl">` inside `_document.ts`.


## This project relies on BGG XML API2 
More info [here](https://boardgamegeek.com/wiki/page/BGG_XML_API2#toc11)

## ToDo

### Starting
- Create a shared list with boardgames from multiples users. Each user needs an alias that exists on bggeek
- Add a view to filter based on number of players, playing time, complexity, categories, mechanics (e.g. https://github.com/EmilStenstrom/mybgg)

### Advanced
- Add firebase to store groups/users
- Plan how to store logs, scores and sessions into the DB
- Store sessions and games played on that session
- Auth with firebase and some email

### Link with boardgamegeek and update stats
- Link user with an account on boardgamegeek. If the login is succesfully, then store a cookie on firebase
- Update stats like game logs and players on bggeek using the cookie.
  

## Bg Stats

- To understand the rating of games: https://boardgamegeek.com/blog/8479/exploring-bgg-database