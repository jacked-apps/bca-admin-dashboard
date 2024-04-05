type SignUpProps = {
  prop?: string;
};

export const SignUp = ({ prop = 'hello' }: SignUpProps) => {
  return <div>{prop}, SignUp</div>;
};
