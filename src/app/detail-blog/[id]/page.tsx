/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { addComment, detailBlog } from '@/app/apis';
import { convertDate } from '@/app/util';
import { CircularProgress, Modal, Rating, TextField } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

const DetailBlog = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [blog, setBlog] = useState<any>()
    const [loading, setLoading] = useState<boolean>(false)
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => { setOpenModal(true); };
    const handleCloseModal = () => setOpenModal(false);
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            userName: "",
            content: "",
            rate: 2.5,
        },
    })
    const fetchData = async () => {
        try {
            const data = await detailBlog(id)
            setBlog(data)
        } catch (error) {
            console.error("Error fetching blog list:", error);
            throw error;
        }
    }
    const addCmt = async (data: any) => {
        try {
            setLoading(true)
            await addComment(data, id)
        } catch (error) {
            console.error("Error fetching blog list:", error);
            throw error;
        } finally {
            handleCloseModal()
            setLoading(false)
        }
    }
    const onSubmit: SubmitHandler<any> = (data) => {
        console.log(data)

        addCmt(data)
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className='w-screen flex items-center justify-center'>
            <div className='w-[70%] shadow-md p-4'>
                {blog ?
                    <div>
                        <div className='text-2xl'>
                            {blog.title}
                        </div>
                        <div className='w-full flex items-center justify-center'>
                            <Image width={300} height={300} alt='' src={blog.image} />
                        </div>
                        <div>
                            {convertDate(blog.createdAt)}
                        </div>
                        <div data-color-mode="light">
                            <MDEditor.Markdown source={blog.content} />

                        </div>
                        <div>
                            <div className='text-xl flex items-center justify-between'>
                                <span>Comment</span>
                                <button onClick={handleOpenModal}>Add</button>
                            </div>
                            <div className='flex flex-col gap-2'>

                                {blog.comments.length > 0 &&
                                    blog.comments.map((i: any, index: number) =>
                                        <div key={index} className='flex flex-col border p-2'>
                                            <Rating name="half-rating" defaultValue={i.rate} precision={0.5} readOnly />
                                            <span>{i.userName}</span>
                                            <span>{i.content}</span>
                                            <span>{convertDate(i.createdAt)}</span>
                                        </div>
                                    )

                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className='w-full h-full flex items-center justify-center'>
                        <CircularProgress />
                    </div>
                }

            </div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[50%] flex flex-col gap-3  p-4 rounded-md">
                    <div className='text-2xl'>
                        Add comment
                    </div>
                    <Controller
                        name="userName"
                        control={control}
                        render={({ field }) => <TextField {...field} id="outlined-basic" label="User name" variant="outlined" />}
                    />
                    <Rating name="half-rating" defaultValue={0} precision={0.5} onClick={(e: any) => setValue("rate", e.target.value)} />
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => <TextField {...field} id="outlined-basic" label="Content" variant="outlined" />}
                    />
                    <button type='submit'>{loading ? <CircularProgress /> : "Add"}</button>
                </form>
            </Modal>
        </div>
    )
}

export default DetailBlog