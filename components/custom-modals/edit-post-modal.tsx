import React, { useEffect, useReducer } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { Post } from "@/types/post";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { editPost } from "@/redux_store/slices/global-slices";

interface EditModalProps {
  post: Post;
}

export default function EditModal({ post }: EditModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();
  const stateDispatch = useDispatch();

  const initialPost: Post = {
    title: post.title,
    email: session?.user?.email!,
    _id: post._id,
    description: post.description,
    image: session?.user?.image!,
    userName: session?.user?.name!,
    tags: post.tags,
    cover: post.cover,
    likes: post.likes,
    comments: post.comments,
    shares: post.shares,
  };

  interface PostModalActions {
    type:
      | "CHANGE_TITLE"
      | "CHANGE_DESCRIPTION"
      | "CHANGE_TAGS"
      | "CHANGE_COVER_PHOTO";
    payload: any;
  }

  const reducerFn = (state: Post, action: PostModalActions) => {
    switch (action.type) {
      case "CHANGE_TITLE":
        return { ...state, title: action.payload.title };

      case "CHANGE_DESCRIPTION":
        return { ...state, description: action.payload.description };

      case "CHANGE_TAGS":
        const tags = action.payload.tags.split(" ");
        return { ...state, tags: tags };

      case "CHANGE_COVER_PHOTO":
        return { ...state, cover: action.payload.cover };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducerFn, initialPost);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case "title":
        dispatch({ type: "CHANGE_TITLE", payload: { title: value } });
        break;
      case "description":
        dispatch({
          type: "CHANGE_DESCRIPTION",
          payload: { description: value },
        });
        break;
      case "tags":
        dispatch({ type: "CHANGE_TAGS", payload: { tags: value } });
        break;
      default:
        break;
    }
  };

  const handlePostEdit = async () => {
    try {
      const response = await axios.put("/api/posts", {
        editedPost: state,
      });

      console.log(response.data);
      stateDispatch(
        editPost({
          _id: state._id,
          editedPost: state,
        })
      );
      toast.success("Edited Post Successfully");
    } catch (error) {
      toast.error("Some error occured");
    }
  };

  useEffect(() => {}, [stateDispatch]);

  return (
    <>
      <Button onPress={onOpen} variant="shadow" color="primary" size="sm">
        Edit
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Post
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  name="title"
                  label="Title"
                  value={state.title}
                  placeholder="Edit Title"
                  variant="bordered"
                  onChange={handleChange}
                />
                <Input
                  name="description"
                  label="Description"
                  value={state.description}
                  placeholder="Edit description"
                  type="text"
                  variant="bordered"
                  onChange={handleChange}
                />
                <Input
                  name="tags"
                  label="Tags"
                  placeholder="Tags"
                  value={state.tags.toString()}
                  type="text"
                  variant="bordered"
                  onChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={handlePostEdit}
                >
                  Post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
