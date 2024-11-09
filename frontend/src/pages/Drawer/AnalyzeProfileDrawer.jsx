import {
    Drawer,
    Flex,
    NativeSelect,
    Button,
    Title,
    Container, Input, rem
} from "@mantine/core";
import appStrings from "../../utils/strings";
import {useState} from "react";
import axios from "axios";
import useNotification from "../../hooks/useNotification.js";
import {notifications} from "@mantine/notifications";
import { IconCheck } from '@tabler/icons-react';

export default function AnalyzeProfileDrawer({ open, onClose, fileNames, jdNames }) {
    const [isLoading, setIsLoading] = useState(false);
    const [projectName, setProjectName] = useState(null);

    const [selectedJD, setSelectedJD] = useState(null);
    const [selectedCV, setSelectedCV] = useState(null);
    const successNotify = useNotification({ type: "success" });
    const handleUploadCV = async () => {
        if (!selectedCV || !selectedJD || !projectName) {
            notifications.show({
                color: 'yellow',
                title: 'Cảnh báo',
                message: 'Hãy điền đầy đủ các phân mục',
                autoClose: 3000, // Auto-close after 2 seconds
            });
            return;
        }

        onClose();
        setIsLoading(true);

        const notificationId = 'upload-cv-notification';

        try {
            // Show the processing notification before the API request
            notifications.show({
                id: notificationId,
                loading: true,
                title: 'Hệ thống đang xử lý phân tích',
                message: 'Đang phân tích CV và JD của bạn',
                autoClose: false,
                withCloseButton: false,
            });

            const response = await axios.post('http://18.139.85.186/compare_cv_jd', {
                project_name: projectName,
                cv_id: selectedCV,
                jd_id: selectedJD
            });

            // Update the notification with a success message
            notifications.update({
                id: notificationId,
                color: 'teal',
                title: 'Phân tích thành công',
                message: 'CV và JD đã được phân tích thành công!',
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                autoClose: 3000, // Auto-close after 2 seconds
                loading: false,
            });
            if(response.status === 200) {
                successNotify(response.data);
            }else{
                notifications.show({
                    id: notificationId,
                    color: 'red',
                    title: 'Phân tích thất bại',
                    message: 'Đã xảy ra lỗi khi phân tích CV và JD.',
                    autoClose: 3000, // Auto-close after 2 seconds
                    loading: false,
                })
            }

            // Show a success notification if needed

        } catch (error) {
            console.error('Error uploading CV:', error);

            // Update the notification with an error message
            notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Phân tích thất bại',
                message: 'Đã xảy ra lỗi khi phân tích CV và JD.',
                autoClose: 3000, // Auto-close after 2 seconds
                loading: false,
            });
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <Drawer opened={open} onClose={onClose} size="100%" position="right">
            <Container size="xs" h={50} mt="md">
                <Flex
                    gap="lg"
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap"
                >
                    <Container>
                        <Title order={1} style={{ width: "100%" }}>
                            {"Phân tích CV của bạn"}
                        </Title>
                        <Input.Wrapper label="Đặt tên cho phân tích" >
                            <Input placeholder="Phân tích CV IT" onChange={(e) => setProjectName(e.target.value)} />
                        </Input.Wrapper>
                        <NativeSelect
                            label="Chọn JD cần phân tích" description="Hãy lựa chọn JD đã được upload"
                            data={jdNames}
                            onChange={(event) => setSelectedJD(event.currentTarget.value)}/>
                        <NativeSelect
                            label="Chọn CV cần phân tích" description="Hãy lựa chọn CV đã được upload"
                            data={fileNames}
                            onChange={(event) => setSelectedCV(event.currentTarget.value)}/>
                        <Flex justify="flex-end" gap="md" style={{ marginTop: "20px" }}>
                            <Button variant="default" onClick={onClose}>
                                {appStrings.language.btn.cancel}
                            </Button>
                            <Button
                                onClick={handleUploadCV}
                                loading={isLoading}
                                // disabled={!selectedJD}
                            >
                                {"Thêm"}
                            </Button>
                        </Flex>
                    </Container>
                </Flex>

            </Container>
        </Drawer>
    );
}
