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
