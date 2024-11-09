import style from "./style.module.css";
import {
  Flex,
  Title,
  Text,
  Container,
  Box,
  Divider,
  Grid,
  Button,
  ActionIcon, Modal, Group, Radio, TextInput, PasswordInput, Paper, Stack, RadioGroup,
} from "@mantine/core";
// import { Carousel } from "@mantine/core";
// import Autoplay from "embla-carousel-autoplay";
import Logo from "../../components/Logo";
import aboutImg from "../../assets/landing-about.png";
import {
  IconArrowRight,
  IconBrandReddit,
  IconBrandTwitter,
  IconMessage,
  IconBrandTelegram,
  IconBrandGithub,
} from "@tabler/icons-react";
import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";

const socials = [
  { icon: IconBrandReddit },
  { icon: IconBrandTwitter },
  { icon: IconMessage },
  { icon: IconBrandTelegram },
  { icon: IconBrandGithub },
];
const supportItems = ["Help Center", "FAQ", "Bug report", "Contact Us"];
const names = ["JobFit", "Forum", "Documentation"];

export default function LandingPage() {
  const navigate = useNavigate();
  const [sticky, setSticky] = useState(false);
  const [showButton, setShowButton] = useState(false); // state mới để kiểm soát việc hiển thị nút up-arrow
  // const autoplay = useRef(Autoplay({ delay: 1500 }));

  const [open, setOpened] = useState(false);
  const [selectedOption, setSelectedOption] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic
    console.log('Logging in with:', username, password);
  };

  const handleRegister = () => {
    // Handle register logic
    console.log('Registering with:', username, password);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setSticky(true);
        setShowButton(true); // hiển thị nút up-arrow khi cuộn xuống 500px
      } else {
        setSticky(false);
        setShowButton(false); // ẩn nút up-arrow khi ở đầu trang
      }

      // Tính vị trí của phần "About" trên màn hình
      const aboutElement = document.querySelector(`.${style.about}`);
      if (aboutElement) {
        const aboutElementPosition = aboutElement.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        // Nếu phần "About" xuất hiện trên màn hình
        if (aboutElementPosition < windowHeight * 0.75) {
          setShowAbout(true); // Kích hoạt hiệu ứng xuất hiện
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Xóa bỏ event listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToTop = () => {
    // hàm xử lý sự kiện click vào nút up-arrow
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
      <>
        <Modal opened={open} onClose={() => setOpened(false)} title="Authentication" size="lg" padding="xl">
          <Paper padding="md" shadow="xs">
            <Stack>
              <Text align="center" size="lg" weight={500}>
                Please {selectedOption === 'login' ? 'Login' : 'Register'}
              </Text>
              <RadioGroup
                  value={selectedOption}
                  onChange={setSelectedOption}
                  orientation="horizontal"
                  spacing="xl"
                  position="center"
              >
                <Group>
                  <Radio value="login" label="Login" />
                  <Radio value="register" label="Register" />
                </Group>
              </RadioGroup>

              <TextInput
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
              <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />

              <Group position="center" grow>
                <Button
                    fullWidth
                    variant="outline"
                    onClick={selectedOption === 'login' ? handleLogin : handleRegister}
                >
                  {selectedOption === 'login' ? 'Login' : 'Register'}
                </Button>
                <Button
                    fullWidth
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                >
                  Skip To Demo
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Modal>

        <Fragment>
          <nav className={`${style.nav} ${sticky ? style.darknav : ""}`}>
            <Logo variant={sticky ? "light" : "auto"} />
            <Flex>
              {sticky ? (
                  <Button
                      className={style.btn}
                      variant="gradient"
                      gradient={{ from: "#89C4DF", to: "#31AFD8", deg: 90 }}
                      onClick={() => setOpened(true)}
                  >
                    Getting Started
                  </Button>
              ) : null}
            </Flex>
          </nav>
          <div className={style.hero}>
            <div className={style.heroContent}>
              <h1>Career Potential Unlocked</h1>
              <p>Take the Next Step Towards Your Dream Job Today!</p>
              <Button
                  size="lg"
                  variant="white"
                  color="#31afd8"
                  onClick={() => setOpened(true)}
                  rightSection={<IconArrowRight />}
              >
                Getting Started
              </Button>
            </div>
          </div>

          {/* <Container size="lg">
        <Carousel
          slideSize="20%"
          slideGap={{ base: 0, sm: "md", md: "sm" }}
          height={200}
          align="start"
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.play}
          dragFree
          loop
          withControls={false}
          style={{ marginTop: "100px" }}
        >
          <Carousel.Slide>
            <img src={Logo1} alt="Logo 1" />
          </Carousel.Slide>
          <Carousel.Slide>
            <img src={Logo2} alt="Logo 2" />
          </Carousel.Slide>
          <Carousel.Slide>
            <img src={Logo3} alt="Logo 3" />
          </Carousel.Slide>
          <Carousel.Slide>
            <img src={Logo4} alt="Logo 4" />
          </Carousel.Slide>
          <Carousel.Slide>
            <img src={Logo5} alt="Logo 5" />
          </Carousel.Slide>
          <Carousel.Slide>
            <img src={Logo6} alt="Logo 6" />
          </Carousel.Slide>
        </Carousel>
      </Container> */}

          {/* <Container size="lg">
        <Flex
          mih={50}
          gap="xs"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Title order={3}>Serivce</Title>
          <Title order={2}>
            Marketing Automation Will Bring More Qualified Leads
          </Title>
        </Flex>
        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <div className={style.card}>
            <div className={style.cardimage}>
              <img
                className={style.imgFluid}
                src={description1}
                alt="alternative"
              />
            </div>
            <div className={style.cardbody}>
              <Title order={5}>Matching JD with CV</Title>
              <Text size="sm" className={style.text}>
                Tivo collects customer data in order to help you analyse
                different situations and take required action
              </Text>
            </div>
          </div>

          <div className={style.card}>
            <div className={style.cardimage}>
              <img
                className={style.imgFluid}
                src={description2}
                alt="alternative"
              />
            </div>
            <div className={style.cardbody}>
              <Title order={5}>Matching question with CV</Title>
              <Text size="sm" className={style.text}>
                Tivo collects customer data in order to help you analyse
                different situations and take required action
              </Text>
            </div>
          </div>

          <div className={style.card}>
            <div className={style.cardimage}>
              <img
                className={style.imgFluid}
                src={description3}
                alt="alternative"
              />
            </div>
            <div className={style.cardbody}>
              <Title order={5}>Manage CV in possition</Title>
              <Text size="sm" className={style.text}>
                Tivo collects customer data in order to help you analyse
                different situations and take required action
              </Text>
            </div>
          </div>
        </Flex>
      </Container> */}

          <Flex justify="center" gap="lg" p={100}>
            <Flex flex={1} align="center" justify="center">
              <img className={style.image} src={aboutImg} />
            </Flex>
            <Flex direction="column" gap="sm" flex={1}>
              <Title order={1}>About us</Title>
              <Title order={4}>Career Growth Through Strategic Connections</Title>
              <Text size="sm" className={style.text}>
                At JobFit, we believe in taking a comprehensive approach to unlocking
                your career potential by connecting you with the right opportunities
                beyond traditional CV submissions.
              </Text>
              <Text size="sm" className={style.text}>
                We advocate for your right to thrive in your chosen career
                trajectory, empowering you with insights into job compatibility for
                informed decisions and professional growth.
              </Text>
            </Flex>
          </Flex>
          {/* Create footer for CVez */}
          <Box>
            <Divider style={{ marginBottom: "30px", marginTop: "50px" }} />
            <Container>
              <Grid>
                <Grid.Col span={4}>
                  <Title style={{ marginBottom: "10px" }} order={5}>
                    Governance
                  </Title>
                  {names.map((name, index) => (
                      <a key={index} href="" className={style.hovertext}>
                        <Text style={{ marginBottom: "10px" }} size="sm">
                          {name}
                        </Text>
                      </a>
                  ))}
                </Grid.Col>
                <Grid.Col span={4}>
                  <Title style={{ marginBottom: "10px" }} order={5}>
                    Support
                  </Title>
                  {supportItems.map((item, index) => (
                      <a key={index} href="" className={style.hovertext}>
                        <Text style={{ marginBottom: "10px" }} size="sm">
                          {item}
                        </Text>
                      </a>
                  ))}
                </Grid.Col>

                <Grid.Col span={4}>
                  <Title style={{ marginBottom: "5px" }} order={5}>
                    Subscribe to JobFit newsletter
                  </Title>
                  <Text size="sm" c="dimmed">
                    Get the latest news and updates
                  </Text>
                  <Button
                      variant="outline"
                      color="red"
                      mt="md"
                      w="100%"
                      rightSection={
                        <IconArrowRight style={{ marginLeft: "-5px" }} size={14} />
                      }
                  >
                    Subscribe
                  </Button>
                  <Flex
                      mih={50}
                      gap="lg"
                      justify="space-between"
                      align="center"
                      direction="row"
                      wrap="wrap"
                      mt={10}
                  >
                    {socials.map((item, i) => (
                        <ActionIcon variant="transparent" color="black" key={i}>
                          <item.icon />
                        </ActionIcon>
                    ))}
                  </Flex>
                </Grid.Col>
              </Grid>
              <Divider
                  style={{ marginTop: 4, marginBottom: "20px", width: "95%" }}
                  size="xs"
              />
              <Flex justify="space-between" align="center" style={{ width: "95%" }}>
                <Text style={{ marginBottom: "20px" }} size="sm" c="dimmed">
                  © 2024 JobFit. All rights reserved
                </Text>
                <Text style={{ marginBottom: "20px" }} size="sm" c="dimmed">
                  Made with 💗 by JobFit
                </Text>
              </Flex>
            </Container>
          </Box>
          {/* {showButton && (
        <img
          src={UpArrow}
          alt="up-arrow"
          className={style.upArrow}
          onClick={scrollToTop}
        />
      )} */}
        </Fragment>


      </>
  );
}
