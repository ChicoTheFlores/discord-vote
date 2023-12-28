
import { IMember } from '@/lib/interfaces/member.interface'
import { Stack, Flex, Box } from '@chakra-ui/layout'
import { Card, CardBody, Avatar, Text } from '@chakra-ui/react'
import React from 'react'
import { Draggable } from "react-beautiful-dnd";

/**
 * Your Component
 */
export function UserCard({ user, index }: { user: IMember, index: number }) {

    return (
        <Draggable
            key={user.id}
            draggableId={user.id.toString()}
            index={index}
        >
            {(draggableProvided, draggableSnapshot) => (
                <Card
                    overflow='hidden'
                    variant='outline'
                    size='sm'
                    maxWidth='320px'
                    {...draggableProvided.dragHandleProps}
                    {...draggableProvided.draggableProps}
                    ref={draggableProvided.innerRef}
                >
                    <Stack>
                        <CardBody>
                            <Flex>
                                <Avatar
                                    size='md'
                                    src={user.url || ''}
                                />
                                <Box
                                    marginLeft='10px'
                                    textAlign='left'
                                >
                                    <Text py='2'>
                                        {user?.displayName}
                                    </Text>
                                    <Text py='2'>
                                        {user.username}
                                    </Text>
                                </Box>
                            </Flex>
                        </CardBody>
                    </Stack>
                </Card>)}
        </Draggable>

    )
}


