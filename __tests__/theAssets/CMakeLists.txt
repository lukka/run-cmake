project(empty)
cmake_minimum_required(VERSION 3.21)

add_executable(main main.cpp)

install(TARGETS main DESTINATION bin)