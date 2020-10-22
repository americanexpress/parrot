<h1 align="center">
	<img src="./parrot-server.png" alt="Parrot-Server" width="50%" />
</h1>

parrot-server is a CLI that creates and starts up an express app that uses [parrot-middleware](https://github.com/americanexpress/parrot/blob/main/packages/parrot-middleware)

## Example

```bash
parrot-server --port 3001 --scenarios /path/to/scenarios.js
# could also use shorthand:
parrot-server -p 3001 -s /path/to/scenarios.js
```
