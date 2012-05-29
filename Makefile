SRC=src
OUT=build

gather: clean
	mkdir -p build
	cp $(SRC)/away3dmod.js $(OUT)
	./buildaway.py gather -i $(SRC) -o $(OUT)

concat: clean
	mkdir -p build
	./buildaway.py concat -i $(SRC) -o $(OUT)/away3d.js

clean:
	rm -rf build
