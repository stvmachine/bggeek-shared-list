# Contributing

There are multiple ways to contribute with this project.

## Improve documentation

- `README.md`:
  - Needs more info about the current state of the project
  - Add instructions of how to start the project for new collaborators.
  - `CONTRIBUTING.md` is a good starting point but it needs more info about the roadmap and actionable ideas.

## Design improvement

Some of the components are being used as out-of-the-box from chakra-ui. Any, design improvement would be appreciated.

### More features

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
