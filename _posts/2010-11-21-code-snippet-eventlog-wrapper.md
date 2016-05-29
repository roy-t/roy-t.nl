---
layout: post
title: Code snippet, EventLog wrapper
date: 2010-11-21 12:19
author: admin
comments: true
categories:
---
This is a small code snippet that allows your application to write log message to the event log. It will also allow you to capture events of these log messages so that your GUI can show pop-ups or other information messages.


(Added a small update a few hours after this was posted for Vista/W7 when not running the application as admin)

Anyway here's the code:

{% highlight csharp %}
     public class Logger
    {
        private static Logger instance;
        public static Logger Instance 
        {
            get { if (instance == null) { instance = new Logger(); } return instance; }
        }

        private Logger(){}

        private string eventSource = "MyApplicationName";   //TODO: change this into the name of your application

        public delegate void logMessage(string message);
        public event logMessage Logged = delegate(string message) { };
        public event logMessage LoggedCritical = delegate(string message) { };
        public event logMessage LoggedWarning = delegate(string message) { };
        public event logMessage LoggedInfo = delegate(string message) { };

        public void Log(string message, EventLogEntryType severity)
        {
            try
            {
                if (!EventLog.SourceExists(eventSource))
                {
                    EventLog.CreateEventSource(eventSource, "Application");
                }
                EventLog.WriteEntry(eventSource, message, severity);
            }
            catch (SecurityException noRightsException)
            {
                //User has no rights to write logs.
            }
            Logged(message);

            switch (severity)
            {
                case EventLogEntryType.Error:
                    LoggedCritical(message);
                    break;
                case EventLogEntryType.Information:
                    LoggedInfo(message);
                    break;
                case EventLogEntryType.Warning:
                    LoggedWarning(message);
                    break;                
            }
        }
    }    
{% endhighlight %}
