#
# soulfege model training code
#

import json
import numpy as np
from keras.utils import to_categorical
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import Dense, InputLayer, Dropout, Flatten, Activation, Input
from sklearn.metrics import confusion_matrix
from mlxtend.plotting import plot_confusion_matrix
import matplotlib.pyplot as plt
import tensorflowjs as tfjs
import argparse

FEATURE_SIZE = 42 #specify feature size (21 for x coordinates, 21 for y coordinates)
CATEGORIES = [] #categories for classification (GLOBAL VARIABLE)

#function that counts the total number of datapoints 
def count_data():
    total = 0
    for cat in CATEGORIES:
        with open('../data/' + cat + '.json') as f:
            data = json.load(f)
            total += len(data)
    return total

def load_data(DATA_SIZE):

    X = np.zeros((DATA_SIZE,FEATURE_SIZE))
    Y = np.zeros((DATA_SIZE,1))

    counter = 0
    for i in range(len(CATEGORIES)):
        with open('../data/' + CATEGORIES[i] + '.json') as f:
            data = json.load(f)
    
        for obj in data:
            x_cords = obj['normal']['x']
            y_cords = obj['normal']['y']
        
            for j in range(len(x_cords)):
                X[counter,j] = x_cords[j]
            
            for j in range(len(y_cords)):
                num = j + len(x_cords) 
                X[counter,num] = y_cords[j]
            
            Y[counter] = i
            counter += 1

    Y = to_categorical(Y)

    return X, Y


def train_model(X_train, X_test, Y_train, Y_test):

    model = Sequential()
    model.add(Input(shape=(42,)))
    model.add(Dense(1000, activation='relu'))
    model.add(Dropout(0.1))
    model.add(Dense(1000, activation='relu'))
    model.add(Dropout(0.2))
    model.add(Dense(100, activation='relu'))
    model.add(Dense(len(CATEGORIES), activation='softmax'))
    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

    history = model.fit(X_train, Y_train, epochs=100, validation_data=(X_test, Y_test))

    # summarize history for accuracy
    plt.plot(history.history['accuracy'])
    plt.plot(history.history['val_accuracy'])
    plt.title('model accuracy')
    plt.ylabel('accuracy')
    plt.xlabel('epoch')
    plt.legend(['train', 'test'], loc='upper left')
    plt.show()
    # summarize history for loss
    plt.plot(history.history['loss'])
    plt.plot(history.history['val_loss'])
    plt.title('model loss')
    plt.ylabel('loss')
    plt.xlabel('epoch')
    plt.legend(['train', 'test'], loc='upper left')
    plt.show()

    return model

def evaluate_model(model, X_test, Y_test):

    Y_pred = model.predict(X_test)
    matrix = confusion_matrix(Y_test.argmax(axis=1), Y_pred.argmax(axis=1))
    fig, ax = plot_confusion_matrix(conf_mat=matrix,class_names=CATEGORIES,colorbar=True)
    plt.show()

def main(args):
    
    #parse arg 
    scale = args.scale

    #set scale
    if scale == 'major':
        CATEGORIES[:] = ['do','re','mi','fa','so','la','ti']
    elif scale == 'minor':
        CATEGORIES[:] = ['do','re','me','fa','so','le','te']
    elif scale == 'chromatic':
        CATEGORIES[:] = ['do','di','ra','re','ri','me','mi','fa','fi','se','so','si','le','la','li','te','ti']
    else:
        print('ERROR: enter a valid argument.')
        return

    #set data size
    DATA_SIZE = count_data()

    #load in data 
    X,Y = load_data(DATA_SIZE)

    #split data into train, validation, and test 
    #
    # train: 60% of data
    # val: 20% of data
    # test: 20% of data

    #split data set into train and test
    X_train, X_test_set, Y_train, Y_test_set = train_test_split(X, Y, test_size=0.4, random_state=42)
    #split data into test and validation
    X_val, X_test, Y_val, Y_test = train_test_split(X_test_set, Y_test_set, test_size=0.5, random_state=42)

    #train model
    model = train_model(X_train, X_val, Y_train, Y_val)

    #evaluate model performance with test data
    evaluate_model(model, X_test, Y_test)

    #save model 
    tfjs.converters.save_keras_model(model, scale)


if __name__ == '__main__':
    argparser = argparse.ArgumentParser()
    argparser.add_argument('-s', '--scale', help='Type of model to train. Can be major, minor, or chromatic.')
    args = argparser.parse_args()
    main(args)
