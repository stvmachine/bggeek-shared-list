## How to start

Copy environemnt file.

```
cp .env.example .env.local
```

Run the project

```
yarn dev
```

## Dev support

### Conventional commits

This project uses commitizen. This library is already included in the repo, so the only that you need to do is to run the next command on instead of `git commit`.

```
yarn run commit
```

Or if you prefer to keep using `git` you can update `.git/hooks/prepare-commit-msg` with the following code:

```bash
#!/bin/bash
exec < /dev/tty && node_modules/.bin/cz --hook || true
```

### Boardgame Game Geek

This project relies heavily on Boardgame Game Geek XML API2. More info [here](https://boardgamegeek.com/wiki/page/BGG_XML_API2#toc11)

## ToDo

### More requested

- Add firebase to store groups/users
- Auth with firebase and some email
- Allow to display a list of games for diferent categories: WTB, WTP, wishlist.
- Add more filters like complexity, categories, mechanics (e.g. https://github.com/EmilStenstrom/mybgg)

### Link with boardgamegeek and update stats

- Link user with an account on boardgamegeek. If the login is succesfully, then store a cookie on firebase
- Update stats like game logs and players on bggeek using the cookie.

### Bg Stats

- Plan how to store logs, scores and sessions into the DB
- Store sessions and games played on that session
- To understand the rating of games: https://boardgamegeek.com/blog/8479/exploring-bgg-database

## Changelog

### V1.0.0:

- Display a list with boardgames from multiples users. Each user needs an alias that exists on bggeek
- Added a view to filter based on number of players, playing time.
- Added sorters by date, name, popularity.
- A simple login with google and email/password
- Some progress on individual pages for authenticated users
