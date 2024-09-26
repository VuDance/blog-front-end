/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Modal, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import MDEditor from '@uiw/react-md-editor';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { styled } from '@mui/material/styles';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { createBlog, detailBlog, editBlog } from '../apis';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormModal = ({ open, handleCloseModal, title, setBlog, getListData }: any) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [valueText, setValueText] = useState<any>("");
  const [img, setImg] = useState<string>('')
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      image: "",
      content: '',
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit: SubmitHandler<any> = (data) => {
    if (title === "Create") {
      createBlogAction(data)
    } else {
      editBlogAction(data)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createBlogAction = async (d: any) => {
    try {
      const data = await createBlog(d)
      setBlog((prev: any) => [...prev, data])
    } catch (error) {
      console.error("Error fetching blog list:", error);
      throw error;
    }
    finally {
      handleCloseModal()
      reset()
    }
  }
  const editBlogAction = async (d: any) => {
    try {
      const data = await editBlog(d, title)
      setBlog((prev: any) => [...prev, data])
    } catch (error) {
      console.error("Error fetching blog list:", error);
      throw error;
    }
    finally {
      handleCloseModal()
      getListData()
      reset()
    }
  }
  const fetchData = async () => {
    try {
      const data = await detailBlog(title)
      // setBlog(data)
      setValue("title", data.title)
      setValue("image", data.image)
      setImg(data.image)
      setValueText(data.content)
      setValue("content", data.content)
      console.log(data)
    } catch (error) {
      console.error("Error fetching blog list:", error);
      throw error;
    }
  }

  useEffect(() => {
    if (title === 'Create') {
      return
    } else {
      fetchData()
    }
  }, [title])

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[50%] flex flex-col gap-3  p-4 rounded-md">
        <h3 className='text-2xl font-bold'>{title}</h3>

        <Controller
          name="title"
          control={control}
          render={({ field }) => <TextField {...field} id="outlined-basic" label="Title" variant="outlined" />}
        />

        <Controller
          name="image"
          control={control}
          render={() =>
            <div className=''>

              <CldUploadWidget
                //signatureEndpoint="/api/sign-cloudinary-params"
                onSuccess={(result) => {
                  if (typeof result.info === "object" && "secure_url" in result.info) {
                    console.log(result.info.url);
                    setImg(result.info.url)
                    setValue("image", result.info.url)
                  }
                }}
                options={{
                  singleUploadAutoClose: true,
                }}
                uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET} >

                {({ open }) => {
                  return (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Upload Image
                    </button>
                  );
                }}
              </CldUploadWidget>
              {img != '' && <Image width={100} height={100} className='w-[100px] h-[100px] mt-2' src={img} alt={''} />}
            </div>
          }
        />
        <Controller
          name="content"
          control={control}
          render={({ field }) => <>
            <MDEditor
              {...field}
              value={valueText}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(value: any) => { setValueText(value); setValue("content", value) }}
              data-color-mode='light'
            />
            {/* <MDEditor.Markdown source={value}  style={{ whiteSpace: 'pre-wrap' }} /> */}
          </>}
        />
        <div className='text-right rounded-md'>
          <button type='submit' className='bg-blue-500 rounded-md text-white p-3'>Submit</button>
        </div>
      </form>
    </Modal>
  )
}

export default FormModal