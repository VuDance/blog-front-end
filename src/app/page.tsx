/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FormModal from "./Components/FormModal";
import { deleteBlog, getListBlog } from "./apis";
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import Link from "next/link";

export default function Home() {
  const [title, setTitle] = useState("Create")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blog, setBlog] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => { setOpenModal(true); setTitle("Create"); };
  const handleCloseModal = () => setOpenModal(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteAction = async (id: string) => {
    try {
      setDeleteLoading(true)
      await deleteBlog(id);
      setBlog((prev: any) => prev.filter((i: any) => i.id != id))
    } catch (error) {
      console.error("Error fetching blog list:", error);
      throw error;
    } finally {
      setDeleteLoading(false)
      handleClose()
    }
  }


  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await getListBlog();
      setBlog(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
      handleClose()
    }
  };
  useEffect(() => {

    fetchData();
  }, []);

  return (
    <div className="w-full h-screen flex-col flex items-center justify-center">
      <IconButton onClick={() => { setTitle("Create"); setOpenModal(true) }}>
        <AddIcon />
      </IconButton>
      <div className="flex items-center justify-center min-w-[30%] border shadow-md max-w-[70%] max-h-[70%]">
        {loading ?
          <CircularProgress />
          :
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell className="w-[10%]"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blog.length > 0 &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  blog.map((i: any, index: number) =>
                    <TableRow key={index}>
                      <TableCell>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Link href={"/detail-blog/" + i.id}>
                          {i.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <IconButton

                          onClick={handleClick}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                        >
                          <MenuItem onClick={handleOpenModal} className="flex gap-3">
                            <VisibilityIcon color="primary" />
                            <span>View</span>
                          </MenuItem>
                          <MenuItem onClick={() => { handleOpenModal(); setTitle(i.id) }} className="flex gap-3">
                            <EditIcon color="warning" />
                            <span>Edit</span>
                          </MenuItem>
                          <MenuItem onClick={() => deleteAction(i.id)} className="flex gap-3">
                            {deleteLoading ?
                              <div className="flex w-full items-center justify-center">
                                <CircularProgress size={18} />
                              </div>
                              :
                              <>
                                <DeleteIcon color="error" />
                                <span>Delete</span></>
                            }
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>


                  )
                }
              </TableBody>
            </Table>
          </TableContainer>
        }
      </div>
      <FormModal open={openModal} handleCloseModal={handleCloseModal} title={title} setBlog={setBlog} getListData={fetchData} />
    </div>
  );
}
