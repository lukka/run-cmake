cmake_minimum_required(VERSION 3.21)
project(test_project)

add_executable(main main.cpp)

install(TARGETS main DESTINATION bin)

include(CPack)