import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import type { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react'
import { IMember } from '@/lib/interfaces/member.interface';

import dynamic from "next/dynamic";
import { DragDropContext } from "react-beautiful-dnd";

const Column = dynamic(() => import("../components/Column"), { ssr: false });

function reorderTasks<T extends unknown[]>(tasks:T, startIndex, endIndex): T{
  const newTaskList = Array.from(tasks);
  const [removed] = newTaskList.splice(startIndex, 1);
  newTaskList.splice(endIndex, 0, removed);
  
  return newTaskList;
};

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session } = useSession();
  const boxBgColor = useColorModeValue('gray.100', 'gray.900');
  const queryAttr = "data-rbd-drag-handle-draggable-id";
  const [users, setUsers] = useState<IMember[]>([]);
  const [me, setMe] = useState<IMember | null>(null);
  const [initial, setInitial] = useState([]);
  const [placeholderProps, setPlaceholderProps] = useState({});
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          const { members, me } = data;
          setUsers(members);
          setMe(me);
          if (!initial.length) setInitial(members);
        } else {
          console.error(`Error fetching data: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      }
    };
    console.log('youtube.com/watch?v=PkT0PJwy8mI')
    fetchData();
  }, []);

  const saveData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('api/votes', {
        method: 'POST',
        body: JSON.stringify({
          memberId: me?.id,
          votes: users.map(user => user.id),
        })
      });
      if (response.ok) {
        const data = await response.json();
        setInitial(users);
        setSaveButtonDisabled(true)
      } else {
        console.error(`Error fetching data: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    }
    finally {
      setIsLoading(false)
    }
  }

  const getDraggedDom = (draggableId) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    return draggedDOM;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newState = reorderTasks(users, source.index, destination.index);
    let disabled = true;
    for (const index in initial) {
      disabled = disabled && initial[index]['id'] === newState[index]['id'];
    }
    setSaveButtonDisabled(disabled);
    setUsers(newState);
  };

  const onDragUpdate = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const draggedDOM = getDraggedDom(draggableId);

    if (!draggedDOM.parentNode) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const destinationIndex = destination.index;
    const sourceIndex = source.index;

    const childrenArray = draggedDOM.parentNode.children
      ? [...draggedDOM.parentNode.children]
      : [];

    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);

    const updatedArray = [
      ...childrenArray.splice(0, destinationIndex),
      movedItem,
      ...childrenArray.splice(destinationIndex + 1),
    ];

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      updatedArray.splice(0, destinationIndex).reduce((total, current) => {
        const style = current.currentStyle || window.getComputedStyle(current);
        const marginBottom = parseFloat(style.marginBottom);
        return total + current.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
    });
  };

  const onDragStart = (result) => {
    const { source, draggableId } = result;
    const draggedDOM = getDraggedDom(draggableId);

    if (!draggedDOM) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = source.index;

    if (!draggedDOM.parentNode) return;

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, sourceIndex)
        .reduce((total, current) => {
          const style =
            current.currentStyle || window.getComputedStyle(current);
          const marginBottom = parseFloat(style.marginBottom);

          return total + current.clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
    });
  };

  if (session) {
    const { user } = session;

    return (
      <>
        <DragDropContext
          onDragStart={onDragStart}
          onDragUpdate={onDragUpdate}
          onDragEnd={onDragEnd}
        >
          <Box bg={boxBgColor} px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
              <Box><Text fontSize="2xl" as="b">Golosovanie</Text></Box>

              <Flex alignItems={'center'}>
                <Stack direction={'row'} spacing={7}>
                  <Button onClick={toggleColorMode}>
                    {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  </Button>

                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={'full'}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}>
                      <Avatar
                        size={'sm'}
                        src={user?.image || ''}
                      />
                    </MenuButton>
                    <MenuList alignItems={'center'}>
                      <br />
                      <Center>
                        <Avatar
                          size={'2xl'}
                          src={user?.image || ''}
                        />
                      </Center>
                      <br />
                      <Center>
                        <Text fontSize='22px' as="b">{user?.name}</Text>
                      </Center>
                      <MenuDivider />
                      <MenuItem onClick={() => signOut()}><Text color={'tomato'}>Logout</Text></MenuItem>
                    </MenuList>
                  </Menu>
                </Stack>
              </Flex>
            </Flex>
          </Box>

          <Flex
            flexDir="column"
            bg="main-bg"
            minH="100vh"
            w="full"
            color="white-text"
            pb="2rem"
          >
            <Flex py="1rem" flexDir="column" align="center">
              <Button
                onClick={saveData}
                isDisabled={saveButtonDisabled}
                spinnerPlacement='start'
                isLoading={isLoading}
              >
                Сохранить
              </Button>
            </Flex>

            <Flex justify="center" px="4rem">
              <Column placeholderProps={placeholderProps} tasks={users} />
            </Flex>
          </Flex>
        </DragDropContext>
      </>
    );
  }
  return (
    <>
      <Box bg={boxBgColor} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box><Text fontSize="2xl" as="b">Golosovanie</Text></Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Button
                onClick={() => signIn()}
                as={'a'}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'blue.400'}
                href={'#'}
                _hover={{
                  bg: 'blue.300',
                }}>
                Sign In
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export default Home
