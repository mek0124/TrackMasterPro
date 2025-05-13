import {
  FooterContainer,
  Span,
  NavLink
} from '../assets/styles/components/footer.style';


export default function Footer() {
  return (
    <FooterContainer>
      <Span>
        &copy;Track Master Pro, 2025
      </Span>

      <Span>
        Join Our
        {/* The below <span> </span> is to create a space between words */}
        {/* <span> </span> */}
        <NavLink
          to="https://discord.gg/uAyPM8WbPw">

          Discord
        </NavLink>
      </Span>

      <Span>
        Developers:
        {/* The below <span> </span> is to create a space between words */}
        {/* <span> </span> */}
        <NavLink
          to="https://github.com/mek0124">
          
          mek0124
        </NavLink>

        <span>, </span>
        <NavLink
          to="https://github.com/">
          
          KastienDevOp215
        </NavLink>
      </Span>
    </FooterContainer>
  );
};
