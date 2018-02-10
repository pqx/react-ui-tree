all:
	./node_modules/.bin/babel lib --out-dir dist
	./node_modules/.bin/lessc lib/react-ui-tree.less > dist/react-ui-tree.css
	./node_modules/.bin/webpack -p
clean:
	rm dist/*
	rm example/bundle*
