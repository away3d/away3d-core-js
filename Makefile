SRC=src
OUT=build

gather: clean
	mkdir -p $(OUT)
	cp $(SRC)/away3dmod.js $(OUT)
	./buildaway.py gather -i $(SRC) -o $(OUT)

concat: clean
	mkdir -p $(OUT)
	./buildaway.py concat -i $(SRC) -o $(OUT)/away3d.js

clean:
	rm -rf $(OUT)
