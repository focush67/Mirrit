import React, { useReducer, useState } from "react";
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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { PostsCluster } from "@/utilities/firebase";
import axios from "axios";
import toast from "react-hot-toast";

export default function UploadModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");

  const initialPost: Post = {
    title: "",
    email: session?.user?.email!,
    _id: undefined,
    description: "",
    image: session?.user?.image!,
    userName: session?.user?.name!,
    tags: [],
    cover: "",
    likes: 0,
    comments: [],
    shares: 0,
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

  const uploadImage = async () => {
    const name = coverPhoto?.name;
    if (coverPhoto === null || coverPhoto === undefined) {
      alert("No image was selected");
      return;
    }

    const imageRef = ref(PostsCluster, `${state.title}/${name}`);
    setIsUploading(true);

    uploadBytes(imageRef, coverPhoto).then(() => {
      getDownloadURL(imageRef)
        .then((imageUrl) => {
          setCoverUrl(imageUrl);
          console.log("CoverURL: ", imageUrl);
          dispatch({
            type: "CHANGE_COVER_PHOTO",
            payload: {
              cover: imageUrl,
            },
          });

          toast.success("Image successfully uploaded");
        })
        .catch((error: any) => {
          console.log(error.message);
          alert(error.message);
          toast.error("Error uploading image");
        });
    });
  };

  const handlePostSubmit = async () => {
    console.log("Present State: ", state);
    if (!coverUrl) {
      alert("CoverURL could not be decoded: ");
      alert(coverUrl);
    }
    try {
      const response = await axios.post("/api/posts", {
        newPost: state,
      });
      // console.log(response.data);
      toast.success("Post Uploaded");
    } catch (error: any) {
      console.log(error);
      toast.error("Error uploading post");
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary" className="">
        New
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create a Post
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  name="title"
                  label="Title"
                  placeholder="Enter title of post"
                  variant="bordered"
                  onChange={handleChange}
                />
                <Input
                  name="description"
                  label="Description"
                  placeholder="Enter description"
                  type="text"
                  variant="bordered"
                  onChange={handleChange}
                />
                <Input
                  name="tags"
                  label="Tags"
                  placeholder="Tags"
                  type="text"
                  variant="bordered"
                  onChange={handleChange}
                />
                <div className="flex flex-row items-center">
                  <Input
                    type="file"
                    variant="faded"
                    onChange={(e: any) => setCoverPhoto(e.target.files[0])}
                  />
                  <Button
                    variant="ghost"
                    color="default"
                    onClick={uploadImage}
                    isLoading={isUploading && coverUrl.length <= 0}
                  >
                    Upload
                  </Button>
                </div>
                <p>{coverUrl}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={isUploading && coverUrl.length <= 0}
                  color="primary"
                  onPress={onClose}
                  onClick={handlePostSubmit}
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
