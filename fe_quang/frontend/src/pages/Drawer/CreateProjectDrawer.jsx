import {
  Drawer,
  Flex,

  Button,
  Title,
  Container, FileInput, Input,
} from "@mantine/core";
import appStrings from "../../utils/strings";


import { useState } from "react";

import axios from "axios";
import useNotification from "../../hooks/useNotification.js";

export default function CreateProjectDrawer({ open, onClose }) {

  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const successNotify = useNotification({ type: "success" });
  const errorNotify = useNotification({ type: "error" });

  const handleInputChange = (file) => {
    setSelectedFile(file);
  };  

  const handleUploadCV = async () => {
    if (!selectedFile) {
      errorNotify({ message: 'Không có file nào được chọn!', title: "Thông báo" });
      return;
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    setIsLoading(true);
  
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in first.');
      }
  
      // Make the API request with the token in headers
      const response = await axios.post('https://jobfitserver.id.vn/upload/cv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      });
  
      // Notify on successful upload
      successNotify({ message: "Tải lên thành công", title: "Thông báo" });
      console.log('File uploaded successfully:', response.data);
  
      onClose(); // Close the drawer after successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
      errorNotify({ message: 'Chỉ có thể upload file: PDF, DOCX', title: "Thông báo" });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
<Drawer opened={open} onClose={onClose} size="100%" position="right">
  <Container size="xs" h={50} mt="md">
    <Flex gap="lg" justify="center" align="center" direction="column" wrap="wrap">
      <Title order={1} style={{ width: "100%" }}>{"Thêm CV của bạn"}</Title>
      <Input.Wrapper style={{ width: "100%" }} label="Đặt tên cho CV của bạn">
        <Input placeholder="CV Sinh Viên FPT" />
      </Input.Wrapper>
      <FileInput
        label={"Upload CVs của bạn tại đây"}
        style={{ width: "100%" }}
        required
        onChange={handleInputChange} // Assumes `handleInputChange` sets `selectedFile`
      />
    </Flex>
    <Flex justify="flex-end" gap="md" style={{ marginTop: "20px" }}>
      <Button variant="default" onClick={onClose}>
        {appStrings.language.btn.cancel}
      </Button>
      <Button
        onClick={handleUploadCV}
        loading={isLoading}
        disabled={!selectedFile}
      >
        {"Thêm"}
      </Button>
    </Flex>
  </Container>
</Drawer>
  );
}
