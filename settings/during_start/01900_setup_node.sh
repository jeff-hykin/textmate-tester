# this is needed for node-gyp to not try to use xcode when on macos
export CC="$(which gcc)"
export CXX="$(which g++)"
# for https://stackoverflow.com/questions/38293984/c-error-unrecognized-command-line-option-stdlib-libc-while-installing-a
if [[ "$OSTYPE" = "darwin"* ]] 
then
    export CXX=clang++
fi
