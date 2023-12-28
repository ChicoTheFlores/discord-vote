import { IMember } from "@/lib/interfaces/member.interface";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

export const topTrollsEmoji = [
    '👑',
    '🥈',
    '🥉',
    '🤡',
    '🚎',
    '🤪',
    '🦧',
    '🥸',
    '🤨',
    '🇺🇬',
];


const Column = ({ tasks, placeholderProps }) => {
    
    return (
        <Flex
            rounded="3px"
            bg="column-bg"
            w="500px"
            h="610px"
            flexDir="column"
            position="relative"
        >
            <Droppable droppableId="col">
                {(droppableProvided) => (
                    <Flex
                        p="1.5rem"
                        flex={1}
                        flexDir="column"
                        {...droppableProvided.droppableProps}
                        ref={droppableProvided.innerRef}
                    >
                        {tasks.map((user: IMember, index) => (
                            <Draggable
                                key={user.id}
                                draggableId={user.id.toString()}
                                index={index}
                            >
                                {(draggableProvided, draggableSnapshot) => (
                                    <Flex
                                        mb="1rem"
                                        h="100px"
                                        bg="card-bg"
                                        rounded="3px"
                                        p="1.5rem"
                                        _active={{ bg: "#23252F" }}
                                        outline="2px solid"
                                        outlineColor={
                                            draggableSnapshot.isDragging
                                                ? "card-border"
                                                : "transparent"
                                        }
                                        boxShadow={
                                            draggableSnapshot.isDragging
                                                ? "0 5px 10px rgba(0, 0, 0, 0.6)"
                                                : "unset"
                                        }
                                        align="center"
                                        zIndex={1}
                                        {...draggableProvided.dragHandleProps}
                                        {...draggableProvided.draggableProps}
                                        ref={draggableProvided.innerRef}
                                    >

                                        <Avatar
                                            size='md'
                                            src={user.url || ''}
                                        />
                                        <Box
                                            marginLeft='10px'
                                            textAlign='left'
                                        >
                                            <Text py='2'>
                                                {(topTrollsEmoji[index] || '') + ' ' +user?.displayName}
                                            </Text>
                                            <Text py='2'>
                                                {user.username}
                                            </Text>
                                        </Box>

                                    </Flex>
                                )}
                            </Draggable>
                        ))}
                        {droppableProvided.placeholder}
                        {!isEmpty(placeholderProps) && (
                            <Flex
                                position="absolute"
                                top={`${placeholderProps.clientY}px`}
                                rounded="3px"
                                opacity={0.6}
                                borderWidth={2}
                                borderStyle="dashed"
                                borderColor="card-border"
                                height={`${placeholderProps.clientHeight}px`}
                                width={`${placeholderProps.clientWidth}px`}
                            />
                        )}
                    </Flex>
                )}
            </Droppable>
        </Flex>
    );
};

export default Column;