import bg from "../../assets/bg.webp";
import Logo from "../../components/Logo";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { Button, Flex, Modal, Text } from "@mantine/core";
import appStrings from "../../utils/strings";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import useNotification from "../../hooks/useNotification";
import { loginApi } from "../../apis/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const errorNofify = useNotification({ type: "error" });

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setIsLogin(true);
      loginApi({
        accessToken: tokenResponse.access_token,
        onFail: (msg) => {
          errorNofify({ message: msg });
        },
        onSuccess: () => {
          navigate("/dashboard");
          setIsLogin(false);
        },
      });
    },
  });

  return (
    <Flex
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
      align="center"
      justify="center"
    >
      <Modal
        opened
        onClose={() => {}}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.1,
          blur: 5,
        }}
        yOffset={70}
        padding={24}
        radius="md"
      >
        <Flex direction="column" align="center">
          <Logo size={25} />
          <Text size="1.3rem" style={{ marginTop: 20 }}>
            {appStrings.language.auth.login}
          </Text>
          <Button
            w="100%"
            variant="gradient"
            gradient={{ from: "#89C4DF", to: "#31AFD8", deg: 90 }}
            style={{ marginTop: 40 }}
            onClick={() => login()}
            leftSection={<IconBrandGoogleFilled size="1rem" />}
            loading={isLogin}
          >
            Google
          </Button>
        </Flex>
      </Modal>
    </Flex>
  );
}
