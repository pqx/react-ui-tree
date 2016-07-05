all:
	babel lib --out-dir dist
	lessc lib/jab-react-tree.less > dist/jab-react-tree.css
	webpack -p
clean:
	rm dist/*
	rm example/bundle*
