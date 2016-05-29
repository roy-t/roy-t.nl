---
layout: post
title: Codesnippet, handy input manager
date: 2010-11-05 14:48
author: admin
comments: true
categories: 
---
Today I was working on a small prototype, however I got carried away a bit with the input management. In the end I spend nearly an hour working on "the mother of all InputManagers". To spare you from this, I've decided to put the snippet online.

Features:
-Registers input from keyboard or gamepad.
-Left, Right, Up, Down mapped to gamepad Dpad and gamepad left thumbstick at the same time.
-Settable deadzones for the gamepad thumbsticks
-Provides, button up, button down and button pressed methods.

The code:  (be sure to see the test code as well, at the bottom of this post)
{% highlight csharp %}
public class InputManager
    {
        public InputManager(InputType type, PlayerIndex player)
        {
            this.inputType = type;
            this.playerIndex = player;

            //Fill dictionaries, TODO: bring this out into an xml file
            inputToKeys = new Dictionary<Inputs, Keys>(10);
            inputToKeys.Add(Inputs.A, Keys.A);
            inputToKeys.Add(Inputs.B, Keys.S);
            inputToKeys.Add(Inputs.Back, Keys.Escape);
            inputToKeys.Add(Inputs.Down, Keys.Down);
            inputToKeys.Add(Inputs.Left, Keys.Left);
            inputToKeys.Add(Inputs.Right, Keys.Right);
            inputToKeys.Add(Inputs.Start, Keys.Space);
            inputToKeys.Add(Inputs.Up, Keys.Up);
            inputToKeys.Add(Inputs.X, Keys.Z);
            inputToKeys.Add(Inputs.Y, Keys.X);

            inputToButtons = new Dictionary<Inputs, Buttons>(10);
            inputToButtons.Add(Inputs.A, Buttons.A);
            inputToButtons.Add(Inputs.B, Buttons.B);
            inputToButtons.Add(Inputs.Back, Buttons.Back);
            inputToButtons.Add(Inputs.Down, Buttons.DPadDown);
            inputToButtons.Add(Inputs.Left, Buttons.DPadLeft);
            inputToButtons.Add(Inputs.Right, Buttons.DPadRight);
            inputToButtons.Add(Inputs.Start, Buttons.Start);
            inputToButtons.Add(Inputs.Up, Buttons.DPadUp);
            inputToButtons.Add(Inputs.X, Buttons.X);
            inputToButtons.Add(Inputs.Y, Buttons.Y);
            //note that left, right, down and up are also mapped
            //to the left thumbstick
        }
        
        public bool IsInputPressed(Inputs input)
        {
            if (inputType == InputType.Keyboard)
            {
                return (curState.IsKeyDown(inputToKeys[input])
                    &amp;&amp; !prevState.IsKeyDown(inputToKeys[input]));
            }
            else //inputType == InputType.Controller
            {
                //Check both left thumbstick dpad and buttons
                return (StickDirectionDown(curPadState, input)
                    &amp;&amp; !StickDirectionDown(prevPadState, input))

                    || (curPadState.IsButtonDown(inputToButtons[input])
                    &amp;&amp; !prevPadState.IsButtonDown(inputToButtons[input]));
            }
        }

        public bool IsInputDown(Inputs input)
        {
            if (inputType == InputType.Keyboard)
            {
                return curState.IsKeyDown(inputToKeys[input]);
            }
            else //inputType == InputType.Controller
            {
                return (StickDirectionDown(curPadState, input)

                || curPadState.IsButtonDown(inputToButtons[input]));
            }
        }

        public bool IsInputUp(Inputs input)
        {
            if (inputType == InputType.Keyboard)
            {
                return prevState.IsKeyUp(inputToKeys[input]);
            }
            else //inputType == InputType.Controller
            {
                return (!StickDirectionDown(curPadState, input)

                    &amp;&amp; prevPadState.IsButtonUp(inputToButtons[input]));
            }
        }


        public bool StickDirectionDown(GamePadState gamePadState, Inputs input)
        {
            if (input == Inputs.Left)
            {
                return (gamePadState.ThumbSticks.Left.X < -thumbStickDeadzone);
            }
            else if (input == Inputs.Right)
            {
                return (gamePadState.ThumbSticks.Left.X > thumbStickDeadzone);
            }
            else if (input == Inputs.Up)
            {
                return (gamePadState.ThumbSticks.Left.Y > thumbStickDeadzone);
            }
            else if (input == Inputs.Down)
            {
                return (gamePadState.ThumbSticks.Left.Y < -thumbStickDeadzone);
            }

            return false;
        }

        public bool InputIsDirection(Inputs input)
        {
            return (input == Inputs.Left || input == Inputs.Right ||
                input == Inputs.Up || input == Inputs.Down);
        }


        public void Update()
        {
            if (inputType == InputType.Keyboard)
            {
                prevState = curState;
                curState = Keyboard.GetState();
            }
            else if (inputType == InputType.Controller)
            {
                prevPadState = curPadState;
                curPadState = GamePad.GetState(playerIndex);
            }
                        
        }        

        #region FieldsAndProperties
        public float thumbStickDeadzone = 0.5f;


        private Dictionary<Inputs, Keys> inputToKeys;
        private Dictionary<Inputs, Buttons> inputToButtons;

        private KeyboardState curState, prevState;
        private GamePadState curPadState, prevPadState;
        private InputType inputType;       
        private PlayerIndex playerIndex;
        #endregion
    }

    public enum Inputs
    {
        A, B, X, Y, Left, Right, Up, Down, Start, Back
    }

    public enum InputType
    {
        Keyboard, Controller
    }
{% endhighlight %}

**Testcode**
{% highlight csharp %}

InputManager input = new InputManager(InputType.Keyboard, PlayerIndex.One);
public void Update(GameTime gameTime){
            input.Update();

            foreach (object value in Enum.GetValues(typeof(Inputs)))
            {
                if (((Inputs)value) == Inputs.Left)
                {

                }
                bool pressed = input.IsInputPressed((Inputs)value);
                bool down = input.IsInputDown((Inputs)value);
                bool notUp = !input.IsInputUp((Inputs)value);

                if (pressed || down)
                {
                    string message = "Input{3} was: Pressed({0}), Down({1}), NotUp({2})";
                    message = String.Format(message, pressed, down, notUp, Enum.GetName(typeof(Inputs), value));
                    Console.Out.WriteLine(message);
                }
            }
}
{% endhighlight %}
